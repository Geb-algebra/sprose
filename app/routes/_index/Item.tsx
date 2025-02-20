import React from "react";
import { useFetcher } from "react-router";
import { BlurOnEnterTextArea } from "~/components/BlurOnEnterTextArea";
import { useStartCardInsert } from "~/map/hooks/useCardInsert";
import type { Item } from "~/map/models";
import { cardShape, cn, focusVisibleStyle } from "~/utils/css";
import styles from "./item.module.css";

function PseudoCard(props: { className?: string }) {
	return (
		<div className={cn(props.className, "shadow-sm bg-card p-2", cardShape)} />
	);
}

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
	// activate after introducing zod for isItem
	// const item = isItem(fetcher.json) ?? props.item;
	const [editing, setEditing] = React.useState(false);
	const onDragStart = useStartCardInsert(props.item);

	return (
		<div className={cn(styles.childLayout, props.className)}>
			<div className={cn("w-[232px] min-h-[88px] relative", styles.content)}>
				{editing ? (
					<BlurOnEnterTextArea
						className={cn(
							focusVisibleStyle,
							"z-20 bg-card border shadow-sm p-2 text-sm mb-2 mr-2 resize-none",
							cardShape,
							props.asParent ? "bg-transparent shadow-none border-none" : "",
						)}
						defaultValue={props.item.description}
						onBlur={(e) => {
							if (e.target.value.trim() !== "") {
								submitJson(
									{ ...props.item, description: e.target.value },
									"PUT",
								);
							} else {
								submitJson(props.item, "DELETE");
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
							"grid place-content-start text-start",
							props.asParent ? "bg-transparent shadow-none border-none" : "",
						)}
						onClick={() => setEditing(true)}
						draggable={!props.asParent}
						onDragStart={onDragStart}
					>
						{props.item.description.split("\n").map((line, i) => (
							<p key={String(i) + line}>{line}</p>
						))}
					</button>
				)}
				{/* {!props.asParent && item.children.length > 0 ? (
					<>
						<PseudoCard className="absolute top-[2px] left-[2px] z-10" />
						<PseudoCard className="absolute top-[4px] left-[4px] z-5" />
					</>
				) : null} */}
			</div>
		</div>
	);
}
