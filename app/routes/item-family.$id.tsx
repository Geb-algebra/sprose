import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useFetcher } from "react-router";
import { Button } from "~/components/Button";
import {
	useAcceptCardInsert,
	useStartCardInsert,
} from "~/map/hooks/useCardInsert";
import { MapRepository, createNewItem } from "~/map/lifecycle";
import type { Item } from "~/map/models";
import { addNewItem, updateItem } from "~/map/services";
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
	const item = props.parent.children[props.siblingIndex];
	const fetcher = useFetcher();
	const onDragStart = useStartCardInsert(props.parent, props.siblingIndex);
	const { insertAt, onDragOver, onDragLeave, onDrop } = useAcceptCardInsert(
		props.parent,
		props.siblingIndex,
		(params) => {
			const { rect, clientX, clientY, insertAt } = params;
			let midpoint: number;
			if (props.parent.isExpanded) {
				switch (insertAt) {
					case "before":
						midpoint = rect.left + (rect.width - 32) / 2 + 32;
						break;
					case "after":
						midpoint = rect.left + (rect.width - 32) / 2 + 32;
						break;
					default:
						midpoint = rect.left + rect.width / 2;
				}
				console.log("midpoint", midpoint);
				console.log("clientX", clientX);
				console.log("rect", rect.left, rect.width);
				return clientX <= midpoint ? "before" : "after";
			}
			switch (insertAt) {
				case "before":
					midpoint = rect.top + (rect.height / 4) * 3;
					break;
				case "after":
					midpoint = rect.top + rect.height / 4;
					break;
				default:
					midpoint = rect.top + rect.height / 2;
			}
			return clientY <= midpoint ? "before" : "after";
		},
	);

	return (
		<div
			className={cn(styles.layout, props.className)}
			onDragOver={onDragOver}
			onDragLeave={onDragLeave}
			onDrop={onDrop}
		>
			{!props.parent.isExpanded ? (
				<ItemCard
					asParent={false}
					parent={props.parent}
					siblingIndex={props.siblingIndex}
					className={styles.family}
				/>
			) : (
				<div
					className={cn(
						"bg-slate-50 rounded-sm shadow-sm border border-slate-100 mr-2 mb-2",
						styles.family,
						styles.familyLayout,
					)}
					draggable
					onDragStart={onDragStart}
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
			)}
			<div
				className={cn(
					"pb-2 pr-2",
					props.parent.isExpanded ? "w-8 h-full" : "w-full h-8",
					insertAt === "none"
						? "hidden"
						: props.parent.isExpanded
							? insertAt === "before"
								? styles.insertLeft
								: styles.insertRight
							: insertAt === "before"
								? styles.insertTop
								: styles.insertBottom,
				)}
			>
				<div className={cn("bg-slate-300 w-full h-full rounded-md")} />
			</div>
		</div>
	);
}
