import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "~/components/Button";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "~/components/ContextMenu";
import {
	useAcceptCardInsert,
	useStartCardInsert,
} from "~/map/hooks/useCardInsert";
import type { Item } from "~/map/models";
import {
	copyItemToClipboard,
	getChildFromClipboard,
} from "~/map/services/clipboard.client";
import { AddItemButton } from "~/routes/_index/AddItemButton";
import { cn, inserterShape } from "~/utils/css";
import { ItemCard } from "./Item";
import styles from "./ItemFamily.module.css";

export function ItemFamily(props: {
	parent: Item;
	siblingIndex: number;
	className?: string;
	onAddItem: (parentId: string, itemAfterAdd: Item) => void;
	onMoveItem: (
		movedItemId: string,
		targetParentId: string,
		targetSiblingIndex: number,
	) => void;
	onUpdateItemText: (itemId: string, description: string) => void;
	onDeleteItem: (itemId: string) => void;
	onToggleExpand: (itemId: string) => void;
}) {
	const onDragStart = useStartCardInsert(props.parent, props.siblingIndex);
	const { insertAt, onDragOver, onDragLeave, onDrop } = useAcceptCardInsert(
		props.parent,
		props.siblingIndex,
		(params) => {
			const { rect, clientX, clientY, insertAt } = params;
			let midpoint: number;
			if (props.parent.isExpanded) {
				switch (insertAt) {
					case "before":
						midpoint = rect.left + (rect.width - 32) / 2 + 32;
						break;
					case "after":
						midpoint = rect.left + (rect.width - 32) / 2 + 32;
						break;
					default:
						midpoint = rect.left + rect.width / 2;
				}
				return clientX <= midpoint ? "before" : "after";
			}
			switch (insertAt) {
				case "before":
					midpoint = rect.top + (rect.height / 4) * 3;
					break;
				case "after":
					midpoint = rect.top + rect.height / 4;
					break;
				default:
					midpoint = rect.top + rect.height / 2;
			}
			return clientY <= midpoint ? "before" : "after";
		},
		props.onMoveItem,
	);

	const item = props.parent.children[props.siblingIndex];

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
						<ItemCard
							asParent={false}
							parent={props.parent}
							siblingIndex={props.siblingIndex}
							onUpdateItemText={props.onUpdateItemText}
							onDeleteItem={props.onDeleteItem}
						/>
					) : (
						<div
							className={cn(
								"bg-card rounded-lg shadow-sm border mr-2 mb-2",
								styles.familyLayout,
							)}
							draggable
							onDragStart={onDragStart}
						>
							<div
								className={cn(
									item.isExpanded
										? styles.expandedLayout
										: styles.collapsedLayout,
									styles.content,
								)}
							>
								<ItemCard
									asParent
									parent={props.parent}
									siblingIndex={props.siblingIndex}
									onUpdateItemText={props.onUpdateItemText}
									onDeleteItem={props.onDeleteItem}
								/>
								{item.children.map((child, siblingIndex) => (
									<ItemFamily
										key={child.id}
										parent={item}
										siblingIndex={siblingIndex}
										className={item.isExpanded ? "row-start-2" : ""}
										onAddItem={props.onAddItem}
										onMoveItem={props.onMoveItem}
										onUpdateItemText={props.onUpdateItemText}
										onDeleteItem={props.onDeleteItem}
										onToggleExpand={props.onToggleExpand}
									/>
								))}
								<AddItemButton
									parent={item}
									className={item.isExpanded ? "row-start-2" : ""}
									onAddItem={props.onAddItem}
									onMoveItem={props.onMoveItem}
								/>
							</div>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className={cn(
									styles.expand,
									"w-4 h-20 ml-auto",
									item.children.length === 0 && "hidden",
								)}
								onClick={() => props.onToggleExpand(item.id)}
							>
								{item.isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
							</Button>
						</div>
					)}
				</ContextMenuTrigger>
				<div
					className={cn(
						inserterShape(props.parent.isExpanded),
						"pr-2 pb-2",
						insertAt === "none"
							? "hidden"
							: props.parent.isExpanded
								? insertAt === "before"
									? styles.insertLeft
									: styles.insertRight
								: insertAt === "before"
									? styles.insertTop
									: styles.insertBottom,
					)}
				>
					<div className={cn("bg-secondary w-full h-full rounded-lg")} />
				</div>
			</div>
			<ContextMenuContent className="w-64">
				<ContextMenuItem onClick={() => copyItemToClipboard(item)}>
					Copy as Markdown List
				</ContextMenuItem>
				<ContextMenuItem
					onClick={async () => {
						const newChildren = await getChildFromClipboard();
						console.log(newChildren);
						if (newChildren) {
							props.onAddItem(item.id, {
								...item,
								children: [...item.children, ...newChildren],
							});
						}
					}}
				>
					Paste Markdown List as Child
				</ContextMenuItem>
				<ContextMenuItem
					className="text-destructive focus:bg-destructive-foreground"
					onClick={() => props.onDeleteItem(item.id)}
				>
					Delete
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
