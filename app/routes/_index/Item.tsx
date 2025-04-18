import React, { useContext } from "react";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "~/components/ContextMenu";
import type { Item } from "~/map/models";
import { copyItemToClipboard, getChildFromClipboard } from "~/map/services/clipboard.client";
import { BlurOnEnterTextArea } from "~/routes/_index/BlurOnEnterTextArea";
import { VerticalDropAcceptor } from "~/routes/_index/DragDrop";
import { cardShape, cn, focusVisibleStyle } from "~/utils/css";
import { mapControllerContext } from "./context";

export function ItemCard(props: {
	parent: Item;
	siblingIndex: number;
	className?: string;
	asParent?: boolean;
}) {
	const { updateItemText, removeItem, updateChildren, addingItemId } =
		useContext(mapControllerContext);
	const item = props.parent.children[props.siblingIndex];
	const [editing, setEditing] = React.useState(addingItemId === item.id);

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
				updateItemText(item, e.target.value);
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
					removeItem(item);
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
							updateChildren(item, newChildren);
						}
					}}
				>
					Paste Markdown List as Child
				</ContextMenuItem>
				<ContextMenuItem
					className="text-destructive focus:bg-destructive-foreground"
					onClick={() => removeItem(item)}
				>
					Delete
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
