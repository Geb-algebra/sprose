import React from "react";
import { useFetcher } from "react-router";
import { BlurOnEnterTextArea } from "~/components/BlurOnEnterTextArea";
import { useAcceptCardInsert } from "~/map/hooks/useCardInsert";
import { MapRepository, createNewItem } from "~/map/lifecycle";
import type { Item } from "~/map/models";
import { addNewItem, isItem } from "~/map/services";
import { cardShape, cn, focusVisibleStyle, inserterShape } from "~/utils/css";
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
	const id = formData.get("id");
	if (typeof id !== "string") {
		throw new Error("Invalid id");
	}
	const map = await MapRepository.get();
	const newItem = createNewItem(description, id);
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
			className={cn(
				props.className,
				props.parent.isExpanded
					? styles.expandedLayout
					: styles.collapsedLayout,
			)}
			onDragOver={onDragOver}
			onDragLeave={onDragLeave}
			onDrop={onDrop}
		>
			<div
				className={cn(
					"pb-2 pr-2",
					inserterShape(props.parent.isExpanded),
					insertAt === "before" ? styles.insert : "hidden",
				)}
			>
				<div className={cn("bg-secondary w-full h-full rounded-lg")} />
			</div>
			{writing ? (
				<BlurOnEnterTextArea
					className={cn(
						"mr-2 mb-2 grid place-content-center bg-card p-2 text-sm resize-none",
						cardShape,
						"h-20",
						focusVisibleStyle,
					)}
					onBlur={(e) => {
						if (e.target.value.trim() === "") {
							setWriting(false);
							return;
						}
						const newItem = createNewItem(e.target.value);
						fetcher.submit(newItem, {
							method: "post",
							action: `/add-item/${props.parent.id}`,
						});
						// XXX: mutate parent's state from a child.
						props.parent.children.push(newItem);
						setWriting(false);
					}}
				/>
			) : null}
			{props.parent.id === "__root" ? (
				<button
					type="button"
					onClick={() => {
						setWriting(true);
					}}
					className={cn(
						"rounded-lg grid place-content-center bg-transparent transition-colors outline-none",
						cardShape,
						"h-20",
						"border-2 border-dashed hover:border-ring focus-visible:border-ring",
						"text-2xl text-border hover:text-ring focus-visible:text-ring",
					)}
				>
					+
				</button>
			) : (
				<div
					className={cn(inserterShape(props.parent.isExpanded), "pr-2 pb-2")}
				>
					<button
						type="button"
						onClick={() => {
							setWriting(true);
						}}
						className={cn(
							"w-full h-full rounded-lg grid place-content-center bg-transparent transition-colors outline-none",
							"border-2 border-dashed hover:border-ring focus-visible:border-ring",
							"text-2xl text-border hover:text-ring focus-visible:text-ring",
						)}
					>
						+
					</button>
				</div>
			)}
		</div>
	);
}
