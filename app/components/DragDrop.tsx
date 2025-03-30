import React from "react";
import { type Item, itemSchema } from "~/map/models";
import { cn } from "~/utils/css";

const cardType = "application/item-card";
type InsertAt = "none" | "before" | "after" | "into";

export function DropAcceptor(props: {
	parent: Item;
	siblingIndex: number;
	moveItem: (movedItemId: string, targetParentId: string, targetSiblingIndex: number) => void;
	children: React.ReactNode;
	className?: string;
}) {
	const [insertAt, setInsertAt] = React.useState<InsertAt>("none");
	const item = props.parent.children[props.siblingIndex];
	return (
		<div
			className={cn(
				"px-1",
				props.className,
				insertAt === "before" && "border-l-2 border-l-primary",
				insertAt === "after" && "border-r-2 border-r-primary",
				insertAt === "into" && "border-2 border-dashed border-primary",
			)}
			onDragOver={(e) => {
				e.preventDefault();
				const rect = e.currentTarget.getBoundingClientRect();
				if (e.clientX < rect.left + 48) {
					setInsertAt("before");
				} else if (e.clientX > rect.right - 48) {
					setInsertAt("after");
				} else {
					setInsertAt("into");
				}
			}}
			onDragLeave={() => setInsertAt("none")}
			onDrop={(e) => {
				e.preventDefault();
				e.stopPropagation();
				const movedItem = itemSchema.parse(
					JSON.parse(e.dataTransfer.getData("application/item-card")),
				);
				if (insertAt === "into") {
					props.moveItem(movedItem.id, item.id, item.children.length);
				} else {
					props.moveItem(
						movedItem.id,
						props.parent.id,
						insertAt === "before" ? props.siblingIndex : props.siblingIndex + 1,
					);
				}
				setInsertAt("none");
			}}
		>
			<div
				draggable
				onDragStart={(e: React.DragEvent) => {
					e.stopPropagation();
					e.dataTransfer.effectAllowed = "move";
					e.dataTransfer.setData(cardType, JSON.stringify(item));
				}}
			>
				{props.children}
			</div>
		</div>
	);
}
