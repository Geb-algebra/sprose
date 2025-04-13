import React, { useContext } from "react";
import { useFetcher } from "react-router";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "~/components/ContextMenu";
import { createNewItem } from "~/map/lifecycle";
import { type Item, itemSchema } from "~/map/models";
import { copyItemToClipboard } from "~/map/services/clipboard.client";
import { getChildFromClipboard } from "~/map/services/clipboard.client";
import { BlurOnEnterTextArea } from "~/routes/_index/BlurOnEnterTextArea";
import { VerticalDropAcceptor } from "~/routes/_index/DragDrop";
import { cardShape, cn, focusVisibleStyle } from "~/utils/css";
import { addingItemContext, mapContext } from "./context";

export function ItemCard(props: {
	parent: Item;
	siblingIndex: number;
	className?: string;
	asParent?: boolean;
}) {
	const fetcher = useFetcher();
	const { addingItemId, setAddingItemId } = useContext(addingItemContext);
	async function submitJson(map: Item, method: "PUT" | "DELETE") {
		await fetcher.submit(map, {
			method,
			encType: "application/json",
		});
	}
	const possiblyNewItem = itemSchema.safeParse(fetcher.json);
	const item = possiblyNewItem.success
		? possiblyNewItem.data
		: props.parent.children[props.siblingIndex];
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
				if (e.target.value.trim() !== "") {
					let newChildren: Item[];
					if (addingItemId === item.id) {
						const newItem = createNewItem("");
						newChildren = [
							...props.parent.children.slice(0, props.siblingIndex),
							{
								...item,
								description: e.target.value,
							},
							newItem,
							...props.parent.children.slice(props.siblingIndex + 1),
						];
						setAddingItemId(newItem.id);
					} else {
						newChildren = [
							...props.parent.children.slice(0, props.siblingIndex),
							{
								...item,
								description: e.target.value,
							},
							...props.parent.children.slice(props.siblingIndex + 1),
						];
					}
					submitJson(
						{
							...props.parent,
							children: newChildren,
						},
						"PUT",
					);
				} else {
					submitJson(item, "DELETE");
					setAddingItemId(null);
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
