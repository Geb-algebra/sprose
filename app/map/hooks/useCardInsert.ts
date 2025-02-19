import React from "react";
import { useFetcher } from "react-router";
import type { Item } from "../models";
import { isItem } from "../services";

const cardType = "application/item-card";
type InsertAt = "none" | "before" | "after";

export function useStartCardInsert(parent: Item, siblingIndex: number) {
	const item = parent.children[siblingIndex];

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
	onMoveItem: (
		movedItemId: string,
		targetParentId: string,
		targetSiblingIndex: number,
	) => void,
) {
	const item = parent.children[siblingIndex];
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
		const item = JSON.parse(data);
		if (!isItem(item)) {
			throw new Error("Invalid item");
		}
		onMoveItem(
			item.id,
			parent.id,
			insertAt === "before" ? siblingIndex : siblingIndex + 1,
		);
		setInsertAt("none");
	}

	return {
		insertAt,
		onDragOver,
		onDragLeave,
		onDrop,
	};
}
