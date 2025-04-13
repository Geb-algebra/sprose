import React from "react";
import { useFetcher } from "react-router";
import { BlurOnEnterTextArea } from "~/components/BlurOnEnterTextArea";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "~/components/ContextMenu";
import { VerticalDropAcceptor } from "~/components/DragDrop";
import { type Item, itemSchema } from "~/map/models";
import { copyItemToClipboard } from "~/map/services/clipboard.client";
import { getChildFromClipboard } from "~/map/services/clipboard.client";
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
		<ContextMenu>
			<VerticalDropAcceptor
				parent={props.parent}
				siblingIndex={props.siblingIndex}
				moveItem={props.moveItem}
				disabledInsertAt={[]}
				className={cn(props.className, "mx-1")}
			>
				<ContextMenuTrigger>{content}</ContextMenuTrigger>
			</VerticalDropAcceptor>
			<ContextMenuContent className="w-64">
				<ContextMenuItem onClick={() => copyItemToClipboard(item)}>
					Copy Markdown List
				</ContextMenuItem>
				<ContextMenuItem
					onClick={async () => {
						const newChildren = await getChildFromClipboard();
						if (newChildren) {
							submitJson({ ...item, children: [...item.children, ...newChildren] }, "PUT");
						}
					}}
				>
					Paste Markdown List as Child
				</ContextMenuItem>
				<ContextMenuItem
					className="text-destructive focus:bg-destructive-foreground"
					onClick={() => submitJson(item, "DELETE")}
				>
					Delete
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
