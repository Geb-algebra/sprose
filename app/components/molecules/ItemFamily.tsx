import { useState } from "react";
import type { Item } from "~/models";
import ItemCard from "../atoms/ItemCard";

import { cn } from "~/utils/css";
import styles from "./ItemFamily.module.css";

export default function ItemFamily(props: { item: Item; className?: string }) {
	const [isExpanded, setIsExpanded] = useState(true);
	if (!isExpanded) {
		return (
			<div className={cn(styles.collapsedLayout, props.className)}>
				<ItemCard item={props.item} />
				{props.item.children.map((child) => (
					<ItemCard key={child.id} item={child} />
				))}
			</div>
		);
	}
	return (
		<div className={cn(styles.expandedLayout, props.className)}>
			<ItemCard item={props.item} className="row-start-1" />
			{props.item.children.map((child) => (
				<ItemFamily key={child.id} item={child} className="row-start-2" />
			))}
		</div>
	);
}
