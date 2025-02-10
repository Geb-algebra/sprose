import { useState } from "react";
import type { Item } from "~/models";
import ItemCard from "../atoms/ItemCard";

import {
	ChevronLeftIcon,
	ChevronRightIcon,
	GripHorizontalIcon,
} from "lucide-react";
import { cn } from "~/utils/css";
import { Button } from "../atoms/Button";
import styles from "./ItemFamily.module.css";

export default function ItemFamily(props: {
	item: Item;
	isParentExpanded: boolean;
	className?: string;
}) {
	const [isExpanded, setIsExpanded] = useState(false);
	if (!props.isParentExpanded) {
		return (
			<ItemCard item={props.item} isStacked={props.item.children.length > 0} />
		);
	}
	return (
		<div
			className={cn(
				"bg-slate-200 rounded-sm shadow-sm",
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
				<ItemCard item={props.item} isStacked={false} />
				{props.item.children.map((child) =>
					child.children.length > 0 ? (
						<ItemFamily
							key={child.id}
							item={child}
							isParentExpanded={isExpanded}
							className={isExpanded ? "row-start-2" : ""}
						/>
					) : (
						<ItemCard
							key={child.id}
							item={child}
							isStacked={false}
							className={isExpanded ? "row-start-2" : ""}
						/>
					),
				)}
			</div>

			<GripHorizontalIcon
				className={cn(styles.handle, "w-4 h-4 m-2 text-slate-400")}
			/>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className={cn(styles.expand, "w-8 h-8 hover:bg-slate-300")}
				onClick={() => setIsExpanded(!isExpanded)}
			>
				{isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
			</Button>
		</div>
	);
}
