import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import { useFetcher, useSubmit } from "react-router";
import { Button } from "~/components/Button";
import { MapRepository, createNewItem } from "~/map/lifecycle";
import type { Item } from "~/map/models";
import { addNewItem, isItem, updateItem } from "~/map/services";
import { AddItemCardButton } from "~/routes/add-item.$parentId";
import { cn } from "~/utils/css";
import type { Route } from "./+types/item-family.$id";
import styles from "./item-family.$id.module.css";
import { ItemCard } from "./item.$id";

export async function clientAction({
	request,
	params,
}: Route.ClientActionArgs) {
	const { id } = params;
	const formData = await request.formData();
	const intent = formData.get("intent");
	if (typeof intent !== "string") {
		throw new Error("Invalid intent");
	}
	if (intent === "addNewItem") {
		const description = formData.get("description");
		if (typeof description !== "string") {
			throw new Error("Invalid description");
		}
		const map = await MapRepository.get();
		const newItem = createNewItem(description);
		const newMap = addNewItem(id, map, newItem);
		await MapRepository.save(newMap);
	} else if (intent === "toggleExpand") {
		const map = await MapRepository.get();
		const toggleTo = formData.get("toggleTo") === "true";
		const newMap = updateItem(map, { id, isExpanded: toggleTo });
		await MapRepository.save(newMap);
		return null;
	}
	return null;
}

export function ItemFamily(props: {
	parent: Item;
	siblingIndex: number;
	className?: string;
}) {
	console.debug("itemparent", props.parent);
	const item = props.parent.children[props.siblingIndex];
	console.debug("child", item);
	const fetcher = useFetcher();
	const [acceptDrop, setAcceptDrop] = React.useState<"none" | "left" | "right">(
		"none",
	);
	if (!props.parent.isExpanded) {
		return (
			<ItemCard
				asParent={false}
				parent={props.parent}
				siblingIndex={props.siblingIndex}
				isStacked={item.children.length > 0}
			/>
		);
	}
	return (
		<div
			className={cn(styles.layout, props.className)}
			onDragOver={(e) => {
				e.preventDefault();
				e.stopPropagation();
				const rect = e.currentTarget.getBoundingClientRect();
				let midpoint: number;
				switch (acceptDrop) {
					case "left":
						midpoint = rect.left + (rect.width / 4) * 3;
						break;
					case "right":
						midpoint = rect.left + rect.width / 4;
						break;
					default:
						midpoint = rect.left + rect.width / 2;
				}
				setAcceptDrop(e.clientX <= midpoint ? "left" : "right");
			}}
			onDragLeave={() => {
				setAcceptDrop("none");
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
						targetSiblingIndex:
							acceptDrop === "left"
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
					"bg-slate-50 rounded-sm shadow-sm border border-slate-100 mr-2 mb-2",
					styles.family,
					styles.familyLayout,
				)}
			>
				<div
					className={cn(
						item.isExpanded ? styles.expandedLayout : styles.collapsedLayout,
						styles.content,
					)}
				>
					<ItemCard
						asParent
						parent={props.parent}
						siblingIndex={props.siblingIndex}
						isStacked={false}
					/>
					{item.children.map((child, siblingIndex) => (
						<ItemFamily
							key={child.id}
							parent={item}
							siblingIndex={siblingIndex}
							className={item.isExpanded ? "row-start-2" : ""}
						/>
					))}
					<AddItemCardButton
						parent={item}
						className={item.isExpanded ? "row-start-2" : ""}
					/>
				</div>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className={cn(styles.expand, "w-4 h-20 ml-auto hover:bg-slate-300")}
					onClick={() => {
						fetcher.submit(
							{
								intent: "toggleExpand",
								toggleTo: !item.isExpanded,
							},
							{ method: "POST", action: `/item-family/${item.id}` },
						);
					}}
				>
					{item.isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
				</Button>
			</div>
			<div
				className={cn(
					"w-52 h-36 border-2 border-dashed border-slate-100 rounded-md",
					acceptDrop === "none" && "hidden",
					acceptDrop === "left" && styles.insertLeft,
					acceptDrop === "right" && styles.insertRight,
				)}
			/>
		</div>
	);
}
