import React from "react";
import { useFetcher } from "react-router";
import { useAcceptCardInsert } from "~/map/hooks/useCardInsert";
import { useStartCardInsert } from "~/map/hooks/useCardInsert";
import { MapRepository } from "~/map/lifecycle";
import type { Item } from "~/map/models";
import { deleteItem, findChildById, isItem, updateItem } from "~/map/services";
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
	const currentItem = findChildById(map, id);
	if (!currentItem || !isItem(currentItem)) {
		throw new Error("Invalid item");
	}
	if (currentItem.description === newDescription) {
		return null;
	}

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
}) {
	const item = props.parent.children[props.siblingIndex];
	const fetcher = useFetcher();
	const [editing, setEditing] = React.useState(false);
	const onDragStart = useStartCardInsert(props.parent, props.siblingIndex);

	return (
		<div className={cn(styles.layout, props.className)}>
			<div className={cn("w-[200px] h-[72px] relative", styles.content)}>
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
						type="button"
						className={cn(
							styles.content,
							focusVisibleStyle,
							"absolute top-0 left-0 z-20 w-48 h-16 bg-slate-100 shadow-sm rounded-md p-2 text-sm mb-2 mr-2",
							"grid place-content-start",
							props.asParent ? "bg-transparent shadow-none" : "",
						)}
						onClick={() => setEditing(true)}
						draggable={!props.asParent}
						onDragStart={onDragStart}
					>
						{item.description}
					</button>
				)}
				{!props.asParent && item.children.length > 0 ? (
					<>
						<PseudoCard className="absolute top-[2px] left-[2px] z-10" />
						<PseudoCard className="absolute top-[4px] left-[4px] z-5" />
					</>
				) : null}
			</div>
		</div>
	);
}
