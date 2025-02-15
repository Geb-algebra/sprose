import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useFetcher, useSubmit } from "react-router";
import AddItemCardButton from "~/components/AddItemCardButton";
import { Button } from "~/components/Button";
import { MapRepository, createNewItem } from "~/map/lifecycle";
import type { Item } from "~/map/models";
import { addNewItem, updateItem } from "~/map/services";
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
	item: Item;
	isParentExpanded: boolean;
	className?: string;
}) {
	const fetcher = useFetcher();
	if (!props.isParentExpanded) {
		return (
			<ItemCard item={props.item} isStacked={props.item.children.length > 0} />
		);
	}
	return (
		<div
			className={cn(
				"bg-white rounded-sm border border-slate-200 mr-2 mb-2",
				styles.layout,
				props.className,
			)}
		>
			<div
				className={cn(
					props.item.isExpanded
						? styles.expandedLayout
						: styles.collapsedLayout,
					styles.content,
				)}
			>
				<ItemCard item={props.item} isStacked={false} />
				{props.item.children.map((child) => (
					<ItemFamily
						key={child.id}
						item={child}
						isParentExpanded={props.item.isExpanded}
						className={props.item.isExpanded ? "row-start-2" : ""}
					/>
				))}
				<AddItemCardButton
					onFinishWriting={(description) => {
						fetcher.submit(
							{ intent: "addNewItem", description },
							{
								action: `/item-family/${props.item.id}`,
								method: "POST",
							},
						);
					}}
					className={props.item.isExpanded ? "row-start-2" : ""}
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
							toggleTo: !props.item.isExpanded,
						},
						{ method: "POST", action: `/item-family/${props.item.id}` },
					);
				}}
			>
				{props.item.isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
			</Button>
		</div>
	);
}
