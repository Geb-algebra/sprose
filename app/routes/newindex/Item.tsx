import React from "react";
import { useFetcher } from "react-router";
import { BlurOnEnterTextArea } from "~/components/BlurOnEnterTextArea";
import { DropAcceptor } from "~/components/DragDrop";
import { type Item, itemSchema } from "~/map/models";
import { cardShape, cn, focusVisibleStyle } from "~/utils/css";

export function ItemCard(props: {
	parent: Item;
	siblingIndex: number;
	className?: string;
	moveItem: (movedItemId: string, targetParentId: string, targetSiblingIndex: number) => void;
	asParent?: boolean;
}) {
	const fetcher = useFetcher();
	function submitJson(map: Item, method: "PUT" | "DELETE") {
		fetcher.submit(map, {
			method,
			encType: "application/json",
		});
	}
	const possiblyNewItem = itemSchema.safeParse(fetcher.json);
	const item = possiblyNewItem.success
		? possiblyNewItem.data
		: props.parent.children[props.siblingIndex];
	const [editing, setEditing] = React.useState(false);

	const content = editing ? (
		<BlurOnEnterTextArea
			className={cn(
				focusVisibleStyle,
				"p-2 shadow-sm border text-sm resize-none",
				!props.asParent && "border shadow-sm bg-card",
				cardShape,
			)}
			defaultValue={item.description}
			onBlur={(e) => {
				if (e.target.value.trim() !== "") {
					submitJson({ ...item, description: e.target.value }, "PUT");
				} else {
					submitJson(item, "DELETE");
				}
				setEditing(false);
			}}
		/>
	) : (
		<button
			type="button"
			className={cn(
				focusVisibleStyle,
				"z-20 p-2 text-sm",
				!props.asParent && "border shadow-sm bg-card",
				cardShape,
				"grid place-content-start text-start",
			)}
			onClick={() => setEditing(true)}
			onKeyDown={(e) => {
				if (e.key === "Backspace") {
					e.preventDefault();
					submitJson(item, "DELETE");
				}
			}}
		>
			{item.description.split("\n").map((line, i) => (
				<p key={String(i) + line}>{line}</p>
			))}
		</button>
	);

	return props.asParent ? (
		<div className={cn(props.className)}>{content}</div>
	) : (
		<DropAcceptor
			parent={props.parent}
			siblingIndex={props.siblingIndex}
			moveItem={props.moveItem}
			className={cn(props.className, "mx-1")}
		>
			{content}
		</DropAcceptor>
	);
}
