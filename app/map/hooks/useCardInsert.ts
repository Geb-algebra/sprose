import React from "react";
import { type Item, itemSchema } from "../models";

const cardType = "application/item-card";
type InsertAt = "none" | "before" | "after";

export function useStartCardInsert(item: Item) {
	function onDragStart(e: React.DragEvent) {
		e.stopPropagation();
		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData(cardType, JSON.stringify(item));
	}
	return onDragStart;
}

export function useAcceptCardInsert(
	parent: Item,
	siblingIndex: number,
	judgeDropPlace: (params: {
		rect: DOMRect;
		clientX: number;
		clientY: number;
		insertAt: InsertAt;
	}) => InsertAt,
	moveItem: (movedItemId: string, targetParentId: string, targetSiblingIndex: number) => void,
) {
	const [insertAt, setInsertAt] = React.useState<InsertAt>("none");

	function onDragOver(e: React.DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		const rect = e.currentTarget.getBoundingClientRect();
		setInsertAt(
			judgeDropPlace({
				rect,
				clientX: e.clientX,
				clientY: e.clientY,
				insertAt,
			}),
		);
	}

	function onDragLeave() {
		setInsertAt("none");
	}

	function onDrop(e: React.DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		const data = e.dataTransfer.getData("application/item-card");
		const item = itemSchema.parse(JSON.parse(data));
		moveItem(item.id, parent.id, insertAt === "before" ? siblingIndex : siblingIndex + 1);
		setInsertAt("none");
	}

	return {
		insertAt,
		onDragOver,
		onDragLeave,
		onDrop,
	};
}
