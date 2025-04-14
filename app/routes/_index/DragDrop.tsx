import React, { useContext } from "react";
import { useFetcher } from "react-router";
import { createNewItem } from "~/map/lifecycle";
import { type Item, itemSchema } from "~/map/models";
import { addNewItem, findChildById, moveItem } from "~/map/services";
import { addingItemContext, mapContext } from "~/routes/_index/context";
import { cn } from "~/utils/css";

const cardType = "application/item-card";
type InsertAt = "none" | "before" | "after" | "into";
type Axis = "horizontal" | "vertical";

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

// New generic DropAcceptor component
function DropAcceptor(props: {
	parent: Item;
	siblingIndex: number;
	children: React.ReactNode;
	disabledInsertAt: InsertAt[];
	axis: Axis;
	className?: string;
}) {
	const { map, submitMap } = useContext(mapContext);
	const { setAddingItemId } = useContext(addingItemContext);
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
			submitMap(
				addNewItem(targetParentId, map, createNewItem("", movedItemId), targetSiblingIndex),
			);
		} else {
			submitMap(moveItem(movedItemId, targetParentId, targetSiblingIndex, map));
		}
	};

	const [insertAt, setInsertAt] = React.useState<InsertAt>("none");

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		const rect = e.currentTarget.getBoundingClientRect();
		let newInsertAt: InsertAt = "none";

		if (props.axis === "horizontal") {
			const buffer = 48; // Horizontal buffer
			if (!props.disabledInsertAt.includes("before") && e.clientX < rect.left + buffer) {
				newInsertAt = "before";
			} else if (!props.disabledInsertAt.includes("after") && e.clientX > rect.right - buffer) {
				newInsertAt = "after";
			} else if (!props.disabledInsertAt.includes("into")) {
				newInsertAt = "into";
			}
		} else {
			// Vertical
			const buffer = 16; // Vertical buffer
			if (!props.disabledInsertAt.includes("before") && e.clientY < rect.top + buffer) {
				newInsertAt = "before";
			} else if (!props.disabledInsertAt.includes("after") && e.clientY > rect.bottom - buffer) {
				newInsertAt = "after";
			} else if (!props.disabledInsertAt.includes("into")) {
				newInsertAt = "into";
			}
		}
		setInsertAt(newInsertAt);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		try {
			const movedItem = itemSchema.parse(JSON.parse(e.dataTransfer.getData(cardType)));
			if (insertAt === "into") {
				moveOrAddItem(movedItem.id, item.id, item.children.length);
			} else {
				moveOrAddItem(
					movedItem.id,
					props.parent.id,
					insertAt === "before" ? props.siblingIndex : props.siblingIndex + 1,
				);
			}
		} catch (error) {
			console.error("Failed to parse dropped item data:", error);
			// Handle potential parsing error, e.g., show a notification
		} finally {
			setInsertAt("none");
		}
	};

	const handleDragLeave = () => {
		setInsertAt("none");
	};

	const borderClasses = {
		horizontal: {
			before: "border-l-2 border-l-primary",
			after: "border-r-2 border-r-primary",
		},
		vertical: {
			before: "border-t-2 border-t-primary",
			after: "border-b-2 border-b-primary",
		},
	};

	return (
		<div
			className={cn(
				"p-1",
				props.className,
				insertAt === "before" && borderClasses[props.axis].before,
				insertAt === "after" && borderClasses[props.axis].after,
				insertAt === "into" && "rounded-lg border-2 border-dashed border-primary",
			)}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<Dragger item={item}>{props.children}</Dragger>
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
	return <DropAcceptor {...props} axis="horizontal" />;
}

export function VerticalDropAcceptor(props: {
	parent: Item;
	siblingIndex: number;
	children: React.ReactNode;
	disabledInsertAt: InsertAt[];
	className?: string;
}) {
	return <DropAcceptor {...props} axis="vertical" />;
}
