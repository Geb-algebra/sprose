import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useFetcher } from "react-router";
import { Button } from "~/components/Button";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "~/components/ContextMenu";
import { useAcceptCardInsert, useStartCardInsert } from "~/map/hooks/useCardInsert";
import { type Item, itemSchema } from "~/map/models";
import { copyItemToClipboard, getChildFromClipboard } from "~/map/services/clipboard.client";
import { cn, inserterShape } from "~/utils/css";
import { AddItemButton } from "./AddItemButton";
import { ItemCard } from "./Item";
import styles from "./ItemFamily.module.css";

export function ItemFamily(props: {
	parent: Item;
	siblingIndex: number;
	className?: string;
	moveItem: (movedItemId: string, targetParentId: string, targetSiblingIndex: number) => void;
}) {
	const fetcher = useFetcher();
	function submitJson(newItem: Item, method: "PUT" | "DELETE") {
		fetcher.submit(newItem, {
			method,
			encType: "application/json",
		});
	}
	const possiblyNewItem = itemSchema.safeParse(fetcher.json);
	const item = possiblyNewItem.success
		? possiblyNewItem.data
		: props.parent.children[props.siblingIndex];
	const onDragStart = useStartCardInsert(item);
	const { insertAt, onDragOver, onDragLeave, onDrop } = useAcceptCardInsert(
		props.parent,
		props.siblingIndex,
		(params) => {
			const { rect, clientX, clientY, insertAt } = params;
			let midpoint: number;
			const base = props.parent.isExpanded ? rect.left : rect.top;
			const size = props.parent.isExpanded ? rect.width : rect.height;
			const place = props.parent.isExpanded ? clientX : clientY;
			if (insertAt === "before") {
				midpoint = base + (size - 32) / 2 + 32;
			} else if (insertAt === "after") {
				midpoint = base + (size - 32) / 2;
			} else {
				midpoint = base + size / 2;
			}
			return place <= midpoint ? "before" : "after";
		},
		props.moveItem,
	);

	return (
		<ContextMenu>
			<div
				className={cn(styles.layout, props.className)}
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				onDrop={onDrop}
			>
				<ContextMenuTrigger className={styles.family}>
					{!props.parent.isExpanded ? (
						<ItemCard asParent={false} item={item} />
					) : (
						<div className={styles.familyLayout} draggable onDragStart={onDragStart}>
							<div
								className={cn(
									styles.header,
									"bg-card h-[120%] w-full flex rounded-t-lg border shadow-sm items-start",
								)}
							>
								<ItemCard asParent item={item} className={cn(styles.self, "relative z-10")} />
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className={cn(styles.expand, "w-4 h-20 ml-auto")}
									disabled={item.children.length === 0}
									onClick={() => submitJson({ ...item, isExpanded: !item.isExpanded }, "PUT")}
								>
									{item.children.length === 0 ? null : item.isExpanded ? (
										<ChevronLeftIcon />
									) : (
										<ChevronRightIcon />
									)}
								</Button>
							</div>
							<div
								className={cn(
									item.isExpanded ? styles.expandedLayout : styles.collapsedLayout,
									styles.children,
									"p-2 rounded-xl border-x border-t inset-shadow-xs bg-background",
								)}
							>
								{item.children.map((child, siblingIndex) => (
									<ItemFamily
										key={child.id}
										parent={item}
										siblingIndex={siblingIndex}
										moveItem={props.moveItem}
									/>
								))}
								<AddItemButton
									parent={item}
									addItem={(addedChild: Item) => {
										submitJson({ ...item, children: [...item.children, addedChild] }, "PUT");
									}}
									moveItem={props.moveItem}
								/>
							</div>
						</div>
					)}
				</ContextMenuTrigger>
				<div
					className={cn(
						inserterShape(props.parent.isExpanded),
						insertAt === "none"
							? "hidden"
							: props.parent.isExpanded
								? insertAt === "before"
									? styles.insertLeft
									: styles.insertRight
								: insertAt === "before"
									? styles.insertTop
									: styles.insertBottom,
						"bg-secondary rounded-lg",
					)}
				/>
			</div>
			<ContextMenuContent className="w-64">
				<ContextMenuItem onClick={() => copyItemToClipboard(item)}>
					Copy as Markdown List
				</ContextMenuItem>
				<ContextMenuItem
					onClick={async () => {
						const newChildren = await getChildFromClipboard();
						if (newChildren) {
							submitJson({ ...item, children: [...item.children, ...newChildren] }, "PUT");
						}
					}}
				>
					Paste Markdown List as Child
				</ContextMenuItem>
				<ContextMenuItem
					className="text-destructive focus:bg-destructive-foreground"
					onClick={() => submitJson(item, "DELETE")}
				>
					Delete
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
