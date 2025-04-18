import { cn } from "~/utils/css";
import styles from "./route.module.css";

import { useContext } from "react";
import { useFetcher } from "react-router";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "~/components/ContextMenu";
import Logo from "~/components/Logo";
import { MapRepository, createNewItem } from "~/map/lifecycle";
import { type Item, itemSchema } from "~/map/models";
import { copyItemToClipboard, getChildFromClipboard } from "~/map/services/clipboard.client";
import { Control } from "~/routes/control/route";
import type { Route } from "./+types/route";
import { ChildrenBox } from "./ChildrenBox";
import { ItemFamily } from "./ItemFamily";
import { MapControllerProvider } from "./context";
import { groupChildren } from "./group-children";

export async function clientLoader() {
	return await MapRepository.get();
}

export async function clientAction({ request }: Route.ClientActionArgs) {
	const newMap = itemSchema.parse(await request.json());
	if (newMap.id !== "__root") {
		throw new Error("Cannot post or put non-root items");
	}
	await MapRepository.save(newMap);
	return null;
}

export default function Page({ loaderData }: Route.ComponentProps) {
	const fetcher = useFetcher();
	const possiblyNewMap = itemSchema.safeParse(fetcher.json);
	const map = possiblyNewMap.success ? possiblyNewMap.data : loaderData;
	function submitMap(map: Item) {
		fetcher.submit(map, {
			method: "PUT",
			encType: "application/json",
		});
	}

	return (
		<MapControllerProvider submitMap={submitMap} map={map}>
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
								"rounded-2xl bg-background shadow-md py-1 overflow-auto",
							)}
						>
							{groupChildren(map).map((group) => {
								if (group.type === "parent") {
									return (
										<ItemFamily
											key={group.startSiblingIndex}
											parent={map}
											siblingIndex={group.startSiblingIndex}
										/>
									);
								}
								return (
									<ChildrenBox
										key={group.startSiblingIndex}
										parent={map}
										startSiblingIndex={group.startSiblingIndex}
										nextStartSiblingIndex={group.nextStartSiblingIndex}
									/>
								);
							})}
						</main>
					</ContextMenuTrigger>
					<ContextMenuContent className="w-64">
						<ContextMenuItem
							onClick={() =>
								submitMap({
									...map,
									children: map.children.map((child) => ({ ...child, isExpanded: false })),
								})
							}
						>
							Collapse All Children
						</ContextMenuItem>
						<ContextMenuItem
							onClick={() =>
								submitMap({
									...map,
									children: map.children.map((child) => ({ ...child, isExpanded: true })),
								})
							}
						>
							Expand All Children
						</ContextMenuItem>
						<ContextMenuItem onClick={() => copyItemToClipboard(map)}>
							Copy as Markdown List
						</ContextMenuItem>
						<ContextMenuItem
							onClick={async () => {
								const newChildren = await getChildFromClipboard();
								if (newChildren) {
									submitMap({
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
								const newItem = createNewItem("");
								submitMap({ ...map, children: [newItem] });
							}}
						>
							Delete All Items
						</ContextMenuItem>
					</ContextMenuContent>
				</div>
			</ContextMenu>
		</MapControllerProvider>
	);
}
