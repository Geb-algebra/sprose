import { cn } from "~/utils/css";
import styles from "./route.module.css";

import { isRouteErrorResponse, useFetcher } from "react-router";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "~/components/ContextMenu";
import Logo from "~/components/Logo";
import { MapRepository } from "~/map/lifecycle";
import { type Item, itemSchema } from "~/map/models";
import { deleteItem, moveItem, updateItem } from "~/map/services";
import { copyItemToClipboard, getChildFromClipboard } from "~/map/services/clipboard.client";
import { Control } from "~/routes/control/route";
import type { Route } from "./+types/route";
import { AddItemButton } from "./AddItemButton";
import { ItemFamily } from "./ItemFamily";

export async function clientLoader() {
	return await MapRepository.get();
}

export async function clientAction({ request }: Route.ClientActionArgs) {
	const newItem = itemSchema.parse(await request.json());
	const map = await MapRepository.get();
	let newMap: Item;
	if (request.method === "DELETE") {
		if (newItem.id === map.id) {
			throw new Error("Cannot delete root item");
		}
		newMap = deleteItem(newItem.id, map);
	} else if (request.method === "PUT") {
		newMap = updateItem(map, newItem);
	} else {
		throw new Error("Invalid method");
	}
	await MapRepository.save(newMap);
	return null;
}

export default function Page({ loaderData }: Route.ComponentProps) {
	const fetcher = useFetcher();
	const possiblyNewMap = itemSchema.safeParse(fetcher.json);
	const map = possiblyNewMap.success ? possiblyNewMap.data : loaderData;
	function submitJson(map: Item) {
		fetcher.submit(map, {
			method: "PUT",
			encType: "application/json",
		});
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
				<Control map={map} className={styles.control} />
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
								moveItem={(
									movedItemId: string,
									targetParentId: string,
									targetSiblingIndex: number,
								) => {
									submitJson(moveItem(movedItemId, targetParentId, targetSiblingIndex, map));
								}}
							/>
						))}
						<AddItemButton
							parent={map}
							addItem={(addedChild: Item) => {
								submitJson({
									...map,
									children: [...map.children, addedChild],
								});
							}}
							moveItem={(
								movedItemId: string,
								targetParentId: string,
								targetSiblingIndex: number,
							) => {
								submitJson(moveItem(movedItemId, targetParentId, targetSiblingIndex, map));
							}}
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
								submitJson({
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
							submitJson({ ...map, children: [] });
						}}
					>
						Delete All Items
					</ContextMenuItem>
				</ContextMenuContent>
			</div>
		</ContextMenu>
	);
}
