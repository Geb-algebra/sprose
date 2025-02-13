import { useState } from "react";
import type { Item } from "~/map/models";
import ItemCard from "./ItemCard";

import {
	ChevronLeftIcon,
	ChevronRightIcon,
	GripHorizontalIcon,
} from "lucide-react";
import { cn } from "~/utils/css";
import { Button } from "./Button";
import styles from "./ItemFamily.module.css";
import AddItemCardButton from "./AddItemCardButton";

export default function ItemFamily(props: {
	item: Item;
	isParentExpanded: boolean;
	onChangeDescription: (description: string, itemId: string) => void;
	onAddItem: (parentId: string) => void;
	className?: string;
}) {
	const [isExpanded, setIsExpanded] = useState(false);
	if (!props.isParentExpanded) {
		return (
			<ItemCard
				item={props.item}
				isStacked={props.item.children.length > 0}
				onChangeDescription={props.onChangeDescription}
			/>
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
					isExpanded ? styles.expandedLayout : styles.collapsedLayout,
					styles.content,
				)}
			>
				<ItemCard
					item={props.item}
					isStacked={false}
					onChangeDescription={props.onChangeDescription}
				/>
				{props.item.children.map((child) => (
					<ItemFamily
						key={child.id}
						item={child}
						isParentExpanded={isExpanded}
						onChangeDescription={props.onChangeDescription}
						onAddItem={props.onAddItem}
						className={isExpanded ? "row-start-2" : ""}
					/>
				))}
				<AddItemCardButton
					onClick={() => {
						props.onAddItem(props.item.id);
					}}
					className={isExpanded ? "row-start-2" : ""}
				/>
			</div>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className={cn(styles.expand, "w-4 h-20 ml-auto hover:bg-slate-300")}
				onClick={() => setIsExpanded(!isExpanded)}
			>
				{isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
			</Button>
		</div>
	);
}
