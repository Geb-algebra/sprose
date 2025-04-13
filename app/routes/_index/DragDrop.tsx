import React, { useContext } from "react";
import { useFetcher } from "react-router";
import { createNewItem } from "~/map/lifecycle";
import { type Item, itemSchema } from "~/map/models";
import { addNewItem, findChildById, moveItem } from "~/map/services";
import { addingItemContext, mapContext } from "~/routes/_index/context";
import { cn } from "~/utils/css";

const cardType = "application/item-card";
type InsertAt = "none" | "before" | "after" | "into";

export function Dragger(props: {
	item: Item;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			draggable
			onDragStart={(e: React.DragEvent) => {
				e.stopPropagation();
				e.dataTransfer.effectAllowed = "move";
				e.dataTransfer.setData(cardType, JSON.stringify(props.item));
			}}
			className={props.className}
		>
			{props.children}
		</div>
	);
}

export function HorizontalDropAcceptor(props: {
	parent: Item;
	siblingIndex: number;
	children: React.ReactNode;
	disabledInsertAt: InsertAt[];
	className?: string;
}) {
	const map = useContext(mapContext);
	const { setAddingItemId } = useContext(addingItemContext);
	const fetcher = useFetcher();
	function submitJson(map: Item) {
		fetcher.submit(map, {
			method: "PUT",
			encType: "application/json",
		});
	}
	const item = props.parent.children[props.siblingIndex];
	const moveOrAddItem = (
		movedItemId: string,
		targetParentId: string,
		targetSiblingIndex: number,
	) => {
		if (!map) {
			throw new Error("Map not found");
		}
		if (!findChildById(map, movedItemId)) {
			// add a new Item
			setAddingItemId(movedItemId);
			submitJson(
				addNewItem(targetParentId, map, createNewItem("", movedItemId), targetSiblingIndex),
			);
		} else {
			submitJson(moveItem(movedItemId, targetParentId, targetSiblingIndex, map));
		}
	};
	const [insertAt, setInsertAt] = React.useState<InsertAt>("none");
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
					moveOrAddItem(movedItem.id, item.id, item.children.length);
				} else {
					moveOrAddItem(
						movedItem.id,
						props.parent.id,
						insertAt === "before" ? props.siblingIndex : props.siblingIndex + 1,
					);
				}
				setInsertAt("none");
			}}
		>
			<Dragger item={item}>{props.children}</Dragger>
		</div>
	);
}

export function VerticalDropAcceptor(props: {
	parent: Item;
	siblingIndex: number;
	children: React.ReactNode;
	disabledInsertAt: InsertAt[];
	className?: string;
}) {
	const map = useContext(mapContext);
	const { setAddingItemId } = useContext(addingItemContext);
	const fetcher = useFetcher();
	function submitJson(map: Item) {
		fetcher.submit(map, {
			method: "PUT",
			encType: "application/json",
		});
	}
	const item = props.parent.children[props.siblingIndex];
	const moveOrAddItem = (
		movedItemId: string,
		targetParentId: string,
		targetSiblingIndex: number,
	) => {
		if (!map) {
			throw new Error("Map not found");
		}
		if (!findChildById(map, movedItemId)) {
			// add a new Item
			setAddingItemId(movedItemId);
			submitJson(
				addNewItem(targetParentId, map, createNewItem("", movedItemId), targetSiblingIndex),
			);
		} else {
			submitJson(moveItem(movedItemId, targetParentId, targetSiblingIndex, map));
		}
	};
	const [insertAt, setInsertAt] = React.useState<InsertAt>("none");
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
					moveOrAddItem(movedItem.id, item.id, item.children.length);
				} else {
					moveOrAddItem(
						movedItem.id,
						props.parent.id,
						insertAt === "before" ? props.siblingIndex : props.siblingIndex + 1,
					);
				}
				setInsertAt("none");
			}}
		>
			<Dragger item={item}>{props.children}</Dragger>
		</div>
	);
}
