import React from "react";
import { useFetcher } from "react-router";
import { MapRepository } from "~/map/lifecycle";
import type { Item } from "~/map/models";
import { deleteItem, isItem, updateItem } from "~/map/services";
import { cn, focusVisibleStyle } from "~/utils/css";
import type { Route } from "./+types/item.$id";
import styles from "./item.$id.module.css";

export async function clientAction({
	request,
	params,
}: Route.ClientActionArgs) {
	const { id } = params;
	const formData = await request.formData();
	const newDescription = formData.get("description");
	if (typeof newDescription !== "string") {
		throw new Error("Invalid description");
	}
	const map = await MapRepository.get();

	let newMap: Item;
	if (newDescription.trim() === "") {
		newMap = deleteItem(id, map);
	} else {
		newMap = updateItem(map, { id, description: newDescription });
	}
	await MapRepository.save(newMap);
	return null;
}

function PseudoCard(props: { className?: string }) {
	return (
		<div
			className={cn(
				props.className,
				"w-48 h-16 shadow-sm bg-slate-100 rounded-md p-2",
			)}
		/>
	);
}

export function ItemCard(props: {
	parent: Item;
	siblingIndex: number;
	asParent: boolean;
	className?: string;
	isStacked?: boolean;
}) {
	const item = props.parent.children[props.siblingIndex];
	const fetcher = useFetcher();
	const [editing, setEditing] = React.useState(false);
	const [acceptDrop, setAcceptDrop] = React.useState<"none" | "top" | "bottom">(
		"none",
	);

	return (
		<div
			className={cn(styles.layout)}
			onDragOver={(e) => {
				if (props.asParent) return;
				e.preventDefault();
				e.stopPropagation();
				const rect = e.currentTarget.getBoundingClientRect();
				let midpoint: number;
				switch (acceptDrop) {
					case "top":
						midpoint = rect.top + (rect.height / 4) * 3;
						break;
					case "bottom":
						midpoint = rect.top + rect.height / 4;
						break;
					default:
						midpoint = rect.top + rect.height / 2;
				}
				setAcceptDrop(e.clientY <= midpoint ? "top" : "bottom");
				console.debug("acceptDrop", e.clientY <= midpoint ? "top" : "bottom");
			}}
			onDragLeave={(e) => {
				if (props.asParent) return;
				setAcceptDrop("none");
			}}
			onDrop={(e) => {
				if (props.asParent) return;
				e.preventDefault();
				e.stopPropagation();
				const data = e.dataTransfer.getData("application/item-card");
				const item = JSON.parse(data);
				console.debug("item", item);
				if (!isItem(item)) {
					throw new Error("Invalid item");
				}
				fetcher.submit(
					{
						movedItemId: item.id,
						targetParentId: props.parent.id,
						targetSiblingIndex:
							acceptDrop === "top"
								? props.siblingIndex
								: props.siblingIndex + 1,
					},
					{ method: "post", action: "/move-item" },
				);
				setAcceptDrop("none");
			}}
		>
			<div
				className={cn(
					"w-[200px] h-[72px] relative",
					props.className,
					styles.content,
				)}
			>
				{editing ? (
					<textarea
						className={cn(
							focusVisibleStyle,
							"absolute top-0 left-0 z-20 w-48 h-16 bg-slate-100 shadow-sm rounded-md p-2 text-sm mb-2 mr-2 resize-none",
							props.asParent ? "bg-transparent shadow-none" : "",
						)}
						// optimistic description update
						defaultValue={
							// (fetcher.formData?.get("description") as string) ??
							item.description
						}
						onBlur={(e) => {
							fetcher.submit(
								{ description: e.target.value },
								{ method: "post", action: `/item/${item.id}` },
							);
							setEditing(false);
						}}
						// biome-ignore lint: should autofocus
						autoFocus
					/>
				) : (
					<button
						draggable
						onDragStart={(e) => {
							e.dataTransfer.effectAllowed = "move";
							e.dataTransfer.setData(
								"application/item-card",
								JSON.stringify(item),
							);
						}}
						type="button"
						className={cn(
							styles.content,
							focusVisibleStyle,
							"absolute top-0 left-0 z-20 w-48 h-16 bg-slate-100 shadow-sm rounded-md p-2 text-sm mb-2 mr-2",
							"grid place-content-start",
							props.asParent ? "bg-transparent shadow-none" : "",
						)}
						onClick={() => setEditing(true)}
					>
						{item.description}
					</button>
				)}
				{props.isStacked ? (
					<>
						<PseudoCard className="absolute top-[2px] left-[2px] z-10" />
						<PseudoCard className="absolute top-[4px] left-[4px] z-5" />
					</>
				) : null}
			</div>
			<div
				className={cn(
					"w-48 h-16 bg-transparent rounded-md mr-2 mb-2 border-2 border-dashed border-slate-100",
					acceptDrop === "none" && "hidden",
					acceptDrop === "bottom" && styles.insertBottom,
					acceptDrop === "top" && styles.insertTop,
				)}
			/>
		</div>
	);
}
