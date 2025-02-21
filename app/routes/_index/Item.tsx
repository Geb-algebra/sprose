import React from "react";
import { useFetcher } from "react-router";
import { BlurOnEnterTextArea } from "~/components/BlurOnEnterTextArea";
import { useStartCardInsert } from "~/map/hooks/useCardInsert";
import { type Item, itemSchema } from "~/map/models";
import { cardShape, cn, focusVisibleStyle } from "~/utils/css";
import styles from "./item.module.css";

export function ItemCard(props: {
	item: Item;
	asParent: boolean;
	className?: string;
}) {
	const fetcher = useFetcher();
	function submitJson(map: Item, method: "PUT" | "DELETE") {
		fetcher.submit(map, {
			method,
			encType: "application/json",
		});
	}
	const possiblyNewItem = itemSchema.safeParse(fetcher.json);
	const item = possiblyNewItem.success ? possiblyNewItem.data : props.item;
	const [editing, setEditing] = React.useState(false);
	const onDragStart = useStartCardInsert(item);

	return (
		<div className={cn(styles.layout, props.className)}>
			<div className={cn("w-[232px] min-h-[88px] relative", styles.content)}>
				{editing ? (
					<BlurOnEnterTextArea
						className={cn(
							focusVisibleStyle,
							"z-20 bg-card border shadow-sm p-2 text-sm mb-2 mr-2 resize-none",
							cardShape,
							!props.asParent && props.item.children.length > 0 ? "border-b-3 border-r-3" : "",
							props.asParent ? "bg-transparent shadow-none border-none" : "",
						)}
						defaultValue={item.description}
						onBlur={(e) => {
							if (e.target.value.trim() !== "") {
								submitJson({ ...item, description: e.target.value }, "PUT");
							} else {
								submitJson(item, "DELETE");
							}
							setEditing(false);
						}}
					/>
				) : (
					<button
						type="button"
						className={cn(
							styles.content,
							focusVisibleStyle,
							"z-20 bg-card border shadow-sm p-2 text-sm mb-2 mr-2",
							cardShape,
							!props.asParent && props.item.children.length > 0 ? "border-b-3 border-r-3" : "",
							"grid place-content-start text-start",
							props.asParent ? "bg-transparent shadow-none border-none" : "",
						)}
						onClick={() => setEditing(true)}
						draggable={!props.asParent}
						onDragStart={onDragStart}
					>
						{item.description.split("\n").map((line, i) => (
							<p key={String(i) + line}>{line}</p>
						))}
					</button>
				)}
			</div>
		</div>
	);
}
