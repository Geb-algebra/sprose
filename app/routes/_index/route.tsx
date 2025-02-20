import { cn } from "~/utils/css";
import styles from "./route.module.css";

import { useFetcher } from "react-router";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "~/components/ContextMenu";
import Logo from "~/components/Logo";
import { MapRepository } from "~/map/lifecycle";
import type { Item } from "~/map/models";
import {
	deleteItem,
	findChildById,
	isItem,
	moveItem,
	updateItem,
} from "~/map/services";
import {
	copyItemToClipboard,
	getChildFromClipboard,
} from "~/map/services/clipboard.client";
import { ItemFamily } from "~/routes/_index/ItemFamily";
import { Control } from "~/routes/control";
import type { Route } from "./+types/route";
import { AddItemButton } from "./AddItemButton";

export async function clientLoader() {
	return await MapRepository.get();
}

export async function clientAction({ request }: Route.ClientActionArgs) {
	const newMap = await request.json();
	if (!isItem(newMap)) {
		throw new Error("Invalid map");
	}
	await MapRepository.save(newMap);
	return null;
}

export default function Page({ loaderData: map }: Route.ComponentProps) {
	const fetcher = useFetcher();

	function submitJson(map: Item) {
		fetcher.submit(map, {
			method: "POST",
			encType: "application/json",
		});
	}

	function onAddItem(parentId: string, itemAfterAdd: Item) {
		const parent = findChildById(map, parentId);
		if (!parent) {
			return;
		}
		parent.children = itemAfterAdd.children;
		submitJson(map);
	}

	function onMoveItem(
		movedItemId: string,
		targetParentId: string,
		targetSiblingIndex: number,
	) {
		submitJson(moveItem(movedItemId, targetParentId, targetSiblingIndex, map));
	}

	function onUpdateItemText(itemId: string, description: string) {
		submitJson(updateItem(map, { id: itemId, description }));
	}

	function onDeleteItem(itemId: string) {
		submitJson(deleteItem(itemId, map));
	}

	function onToggleExpand(itemId: string) {
		const item = findChildById(map, itemId);
		if (!item) {
			return;
		}
		item.isExpanded = !item.isExpanded;
		submitJson(map);
	}

	return (
		<ContextMenu>
			<div className={cn(styles.bodyLayout, "bg-secondary")}>
				<h1
					className={cn(
						styles.title,
						"text-2xl px-2 grid justify-start items-center grid-flow-col gap-2 text-primary",
					)}
				>
					<Logo fill="var(--primary)" size={42} />
					Sprose
				</h1>
				<Control className={styles.control} />
				<ContextMenuTrigger asChild>
					<main
						className={cn(
							styles.main,
							styles.mainLayout,
							"rounded-2xl bg-background shadow-md p-2 overflow-auto",
						)}
					>
						{map.children.map((item, siblingIndex) => (
							<ItemFamily
								key={item.id}
								parent={map}
								siblingIndex={siblingIndex}
								onAddItem={onAddItem}
								onMoveItem={onMoveItem}
								onUpdateItemText={onUpdateItemText}
								onDeleteItem={onDeleteItem}
								onToggleExpand={onToggleExpand}
							/>
						))}
						<AddItemButton
							parent={map}
							onAddItem={onAddItem}
							onMoveItem={onMoveItem}
						/>
					</main>
				</ContextMenuTrigger>
				<ContextMenuContent className="w-64">
					<ContextMenuItem onClick={() => copyItemToClipboard(map)}>
						Copy as Markdown List
					</ContextMenuItem>
					<ContextMenuItem
						onClick={async () => {
							const newChildren = await getChildFromClipboard();
							if (newChildren) {
								onAddItem(map.id, {
									...map,
									children: [...map.children, ...newChildren],
								});
							}
						}}
					>
						Paste Markdown List
					</ContextMenuItem>
					<ContextMenuItem
						className="text-destructive focus:bg-destructive-foreground"
						onClick={() => {
							map.children = [];
							submitJson(map);
						}}
					>
						Delete All Items
					</ContextMenuItem>
				</ContextMenuContent>
			</div>
		</ContextMenu>
	);
}
