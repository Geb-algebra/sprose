import React from "react";
import { type Item, itemSchema } from "../models";

const cardType = "application/item-card";
type InsertAt = "none" | "before" | "after";

export function useStartCardInsert(item: Item) {
	return (e: React.DragEvent) => {
		e.stopPropagation();
		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData(cardType, JSON.stringify(item));
	};
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

	const handlers = {
		onDragOver: (e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setInsertAt(
				judgeDropPlace({
					rect: e.currentTarget.getBoundingClientRect(),
					clientX: e.clientX,
					clientY: e.clientY,
					insertAt,
				}),
			);
		},

		onDragLeave: () => setInsertAt("none"),

		onDrop: (e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			try {
				const item = itemSchema.parse(JSON.parse(e.dataTransfer.getData(cardType)));
				// Calculate index adjustment if moving within the same parent
				const siblingIndexAfterItemLeft =
					parent.children.some((c) => c.id === item.id) &&
					parent.children.findIndex((child) => child.id === item.id) < siblingIndex
						? siblingIndex - 1
						: siblingIndex;

				moveItem(
					item.id,
					parent.id,
					insertAt === "before" ? siblingIndexAfterItemLeft : siblingIndexAfterItemLeft + 1,
				);
			} finally {
				setInsertAt("none");
			}
		},
	};

	return { insertAt, ...handlers };
}
