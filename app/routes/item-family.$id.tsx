import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useFetcher } from "react-router";
import { Button } from "~/components/Button";
import {
	useAcceptCardInsert,
	useStartCardInsert,
} from "~/map/hooks/useCardInsert";
import { MapRepository, createNewItem } from "~/map/lifecycle";
import type { Item } from "~/map/models";
import { addNewItem, findChildById, updateItem } from "~/map/services";
import { AddItemCardButton } from "~/routes/add-item.$parentId";
import { cn, inserterShape } from "~/utils/css";
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
		const item = findChildById(map, id);
		if (!item) {
			throw new Error("Invalid item");
		}
		if (item.children.length === 0) {
			return null;
		}
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

	const fetcherData = fetcher.formData?.get("toggleTo");
	const item = {
		...props.parent.children[props.siblingIndex],
		isExpanded: fetcherData
			? fetcherData === "true"
			: props.parent.children[props.siblingIndex].isExpanded,
	};

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
						"bg-card rounded-lg shadow-sm border mr-2 mb-2",
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
						className={cn(
							styles.expand,
							"w-4 h-20 ml-auto",
							item.children.length === 0 && "hidden",
						)}
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
					inserterShape(props.parent.isExpanded),
					"pr-2 pb-2",
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
				<div className={cn("bg-secondary w-full h-full rounded-lg")} />
			</div>
		</div>
	);
}
