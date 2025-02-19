import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "~/components/Button";
import {
	useAcceptCardInsert,
	useStartCardInsert,
} from "~/map/hooks/useCardInsert";
import type { Item } from "~/map/models";
import { AddItemButton } from "~/routes/_index/AddItemButton";
import { cn, inserterShape } from "~/utils/css";
import { ItemCard } from "./Item";
import styles from "./ItemFamily.module.css";

export function ItemFamily(props: {
	parent: Item;
	siblingIndex: number;
	className?: string;
	onAddItem: (parentId: string, description: string) => void;
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
		<div
			className={cn(styles.layout, props.className)}
			onDragOver={onDragOver}
			onDragLeave={onDragLeave}
			onDrop={onDrop}
		>
			{!props.parent.isExpanded ? (
				<ItemCard
					asParent={false}
					parent={props.parent}
					siblingIndex={props.siblingIndex}
					className={styles.family}
					onUpdateItemText={props.onUpdateItemText}
					onDeleteItem={props.onDeleteItem}
				/>
			) : (
				<div
					className={cn(
						"bg-card rounded-lg shadow-sm border mr-2 mb-2",
						styles.family,
						styles.familyLayout,
					)}
					draggable
					onDragStart={onDragStart}
				>
					<div
						className={cn(
							item.isExpanded ? styles.expandedLayout : styles.collapsedLayout,
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
	);
}
