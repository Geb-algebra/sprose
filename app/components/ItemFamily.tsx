import { useState } from "react";
import type { Item } from "~/map/models";
import ItemCard from "./ItemCard";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "~/utils/css";
import AddItemCardButton from "./AddItemCardButton";
import { Button } from "./Button";
import styles from "./ItemFamily.module.css";

export default function ItemFamily(props: {
	item: Item;
	isParentExpanded: boolean;
	onChangeDescription: (description: string, itemId: string) => void;
	onFinishWritingNewItem: (parentId: string, description: string) => void;
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
						onFinishWritingNewItem={props.onFinishWritingNewItem}
						className={isExpanded ? "row-start-2" : ""}
					/>
				))}
				<AddItemCardButton
					onFinishWriting={(description) => {
						props.onFinishWritingNewItem(props.item.id, description);
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
