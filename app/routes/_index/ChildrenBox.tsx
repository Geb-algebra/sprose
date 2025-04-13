import { useFetcher } from "react-router";
import type { Item } from "~/map/models";
import { AddItemButton } from "./AddItemButton";
import styles from "./ChildrenBox.module.css";
import { ItemCard } from "./Item";
import { ItemFamily } from "./ItemFamily";
import type { ItemGroup } from "./group-children";

export function ChildrenBox(props: {
	parent: Item;
	startSiblingIndex: number;
	nextStartSiblingIndex: number;
	moveItem: (movedItemId: string, targetParentId: string, targetSiblingIndex: number) => void;
}) {
	const fetcher = useFetcher();
	function submitJson(newItem: Item, method: "PUT" | "DELETE") {
		fetcher.submit(newItem, {
			method,
			encType: "application/json",
		});
	}
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
							moveItem={props.moveItem}
						/>
					) : (
						<ItemCard
							key={item.id}
							parent={props.parent}
							siblingIndex={props.startSiblingIndex + index}
							moveItem={props.moveItem}
							asParent={false}
						/>
					),
				)}
			<AddItemButton
				parent={props.parent}
				addItem={(addedChild: Item) => {
					submitJson(
						{
							...props.parent,
							children: [
								...props.parent.children.slice(0, props.nextStartSiblingIndex),
								addedChild,
								...props.parent.children.slice(props.nextStartSiblingIndex),
							],
						},
						"PUT",
					);
				}}
				moveItem={() => {}}
			/>
		</div>
	);
}
