import React from "react";
import { useFetcher } from "react-router";
import { MapRepository, createNewItem } from "~/map/lifecycle";
import type { Item } from "~/map/models";
import { addNewItem, isItem } from "~/map/services";
import { cn, focusVisibleStyle } from "~/utils/css";
import type { Route } from "./+types/add-item.$parentId";
import styles from "./add-item.$parentId.module.css";

export async function clientAction({
	request,
	params,
}: Route.ClientActionArgs) {
	const parentId = params.parentId;
	const formData = await request.formData();
	const description = formData.get("description");
	if (typeof parentId !== "string" || typeof description !== "string") {
		throw new Error("Invalid form data");
	}
	const map = await MapRepository.get();
	const newItem = createNewItem(description);
	const newMap = addNewItem(parentId, map, newItem);
	await MapRepository.save(newMap);
	return null;
}

export function AddItemCardButton(props: {
	parent: Item;
	className?: string;
}) {
	console.debug("props.parent");
	console.debug(props.parent);
	const [writing, setWriting] = React.useState(false);
	const [acceptDrop, setAcceptDrop] = React.useState(false);
	const fetcher = useFetcher();
	return (
		<div
			className={cn(props.className, styles.layout)}
			onDragOver={(e) => {
				e.preventDefault();
				e.stopPropagation();
				setAcceptDrop(true);
			}}
			onDragLeave={(e) => {
				setAcceptDrop(false);
			}}
			onDrop={(e) => {
				e.preventDefault();
				e.stopPropagation();
				const data = e.dataTransfer.getData("application/item-card");
				const item = JSON.parse(data);
				if (!isItem(item)) {
					throw new Error("Invalid item");
				}
				fetcher.submit(
					{
						movedItemId: item.id,
						targetParentId: props.parent.id,
						targetSiblingIndex: props.parent.children.length,
					},
					{ method: "post", action: "/move-item" },
				);
				setAcceptDrop(false);
			}}
		>
			<div
				className={cn(
					"w-48 h-16 bg-transparent rounded-md mr-2 mb-2 border-2 border-dashed border-slate-100",
					acceptDrop ? styles.insert : "hidden",
				)}
			/>
			{writing ? (
				<textarea
					className={cn(
						"w-48 h-16 mr-2 mb-2 grid place-content-center bg-slate-100 rounded-md p-2 text-sm",
						focusVisibleStyle,
					)}
					onBlur={(e) => {
						if (e.target.value.trim() === "") {
							setWriting(false);
							return;
						}
						fetcher.submit(
							{ description: e.target.value },
							{ method: "post", action: `/add-item/${props.parent.id}` },
						);
						setWriting(false);
					}}
					// biome-ignore lint: should autofocus
					autoFocus
				/>
			) : (
				<button
					type="button"
					onClick={() => {
						setWriting(true);
					}}
					className={cn(
						"w-48 h-16 mr-2 mb-2 grid place-content-center bg-transparent rounded-md transition-colors",
						"border-2 border-dashed border-slate-100 hover:border-slate-400 focus-visible:border-slate-400",
						"text-2xl text-slate-100 hover:text-slate-400 focus-visible:text-slate-400 ",
					)}
				>
					+
				</button>
			)}
		</div>
	);
}
