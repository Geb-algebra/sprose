import type { Item } from "~/map/models";
import styles from "./ChildrenBox.module.css";
import { ItemCard } from "./Item";
import { ItemFamily } from "./ItemFamily";

export function ChildrenBox(props: {
	parent: Item;
	startSiblingIndex: number;
	nextStartSiblingIndex: number;
}) {
	return (
		<div className={styles.layout}>
			{props.parent.children
				.slice(props.startSiblingIndex, props.nextStartSiblingIndex)
				.map((item, index) =>
					item.children.length !== 0 ? (
						<ItemFamily
							key={item.id}
							parent={props.parent}
							siblingIndex={props.startSiblingIndex + index}
						/>
					) : (
						<ItemCard
							key={item.id}
							parent={props.parent}
							siblingIndex={props.startSiblingIndex + index}
							asParent={false}
						/>
					),
				)}
		</div>
	);
}
