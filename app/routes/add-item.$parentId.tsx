import React from "react";
import { useFetcher } from "react-router";
import { useAcceptCardInsert } from "~/map/hooks/useCardInsert";
import { MapRepository, createNewItem } from "~/map/lifecycle";
import type { Item } from "~/map/models";
import { addNewItem, isItem } from "~/map/services";
import { cardShape, cn, focusVisibleStyle } from "~/utils/css";
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
	const [writing, setWriting] = React.useState(false);
	const fetcher = useFetcher();
	const { insertAt, onDragOver, onDragLeave, onDrop } = useAcceptCardInsert(
		props.parent,
		props.parent.children.length,
		() => "before",
	);
	return (
		<div
			className={cn(props.className, styles.layout)}
			onDragOver={onDragOver}
			onDragLeave={onDragLeave}
			onDrop={onDrop}
		>
			<div
				className={cn(
					"pb-2 pr-2 w-full h-8",
					insertAt === "before" ? styles.insert : "hidden",
				)}
			>
				<div className={cn("bg-secondary w-full h-full rounded-lg")} />
			</div>
			{writing ? (
				<textarea
					className={cn(
						"mr-2 mb-2 grid place-content-center bg-card p-2 text-sm",
						cardShape,
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
						"mr-2 mb-2 grid place-content-center bg-transparent transition-colors outline-none",
						cardShape,
						"border-2 border-dashed hover:border-ring focus-visible:border-ring",
						"text-2xl text-border hover:text-ring focus-visible:text-ring",
					)}
				>
					+
				</button>
			)}
		</div>
	);
}
