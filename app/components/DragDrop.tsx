import React from "react";
import { type Item, itemSchema } from "~/map/models";
import { cn } from "~/utils/css";

const cardType = "application/item-card";
type InsertAt = "none" | "before" | "after" | "into";

export function HorizontalDropAcceptor(props: {
	parent: Item;
	siblingIndex: number;
	moveItem: (movedItemId: string, targetParentId: string, targetSiblingIndex: number) => void;
	children: React.ReactNode;
	disabledInsertAt: InsertAt[];
	className?: string;
}) {
	const [insertAt, setInsertAt] = React.useState<InsertAt>("none");
	const item = props.parent.children[props.siblingIndex];
	return (
		<div
			className={cn(
				"p-1",
				props.className,
				insertAt === "before" && "border-l-2 border-l-primary",
				insertAt === "after" && "border-r-2 border-r-primary",
				insertAt === "into" && "rounded-lg border-2 border-dashed border-primary",
			)}
			onDragOver={(e) => {
				e.preventDefault();
				e.stopPropagation();
				const rect = e.currentTarget.getBoundingClientRect();
				if (!props.disabledInsertAt.includes("before") && e.clientX < rect.left + 48) {
					setInsertAt("before");
				} else if (!props.disabledInsertAt.includes("after") && e.clientX > rect.right - 48) {
					setInsertAt("after");
				} else if (!props.disabledInsertAt.includes("into")) {
					setInsertAt("into");
				} else {
					setInsertAt("none");
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

export function VerticalDropAcceptor(props: {
	parent: Item;
	siblingIndex: number;
	moveItem: (movedItemId: string, targetParentId: string, targetSiblingIndex: number) => void;
	children: React.ReactNode;
	disabledInsertAt: InsertAt[];
	className?: string;
}) {
	const [insertAt, setInsertAt] = React.useState<InsertAt>("none");
	const item = props.parent.children[props.siblingIndex];
	return (
		<div
			className={cn(
				"p-1",
				props.className,
				insertAt === "before" && "border-t-2 border-t-primary",
				insertAt === "after" && "border-b-2 border-b-primary",
				insertAt === "into" && "rounded-lg border-2 border-dashed border-primary",
			)}
			onDragOver={(e) => {
				e.preventDefault();
				e.stopPropagation();
				const rect = e.currentTarget.getBoundingClientRect();
				if (!props.disabledInsertAt.includes("before") && e.clientY < rect.top + 16) {
					setInsertAt("before");
				} else if (!props.disabledInsertAt.includes("after") && e.clientY > rect.bottom - 16) {
					setInsertAt("after");
				} else if (!props.disabledInsertAt.includes("into")) {
					setInsertAt("into");
				} else {
					setInsertAt("none");
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
