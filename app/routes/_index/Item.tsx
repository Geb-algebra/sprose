import React from "react";
import { BlurOnEnterTextArea } from "~/components/BlurOnEnterTextArea";
import { useStartCardInsert } from "~/map/hooks/useCardInsert";
import type { Item } from "~/map/models";
import { cardShape, cn, focusVisibleStyle } from "~/utils/css";
import styles from "./Item.module.css";

function PseudoCard(props: { className?: string }) {
	return (
		<div className={cn(props.className, "shadow-sm bg-card p-2", cardShape)} />
	);
}

export function ItemCard(props: {
	parent: Item;
	siblingIndex: number;
	asParent: boolean;
	className?: string;
	onUpdateItemText: (itemId: string, description: string) => void;
	onDeleteItem: (itemId: string) => void;
}) {
	const item = props.parent.children[props.siblingIndex];
	const [editing, setEditing] = React.useState(false);
	const onDragStart = useStartCardInsert(props.parent, props.siblingIndex);

	return (
		<div className={cn(styles.layout, props.className)}>
			<div className={cn("w-[232px] min-h-[88px] relative", styles.content)}>
				{editing ? (
					<BlurOnEnterTextArea
						className={cn(
							focusVisibleStyle,
							"z-20 bg-card border shadow-sm p-2 text-sm mb-2 mr-2 resize-none",
							cardShape,
							props.asParent ? "bg-transparent shadow-none border-none" : "",
						)}
						defaultValue={item.description}
						onBlur={(e) => {
							if (e.target.value.trim() !== "") {
								props.onUpdateItemText(item.id, e.target.value);
							} else {
								props.onDeleteItem(item.id);
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
						{item.description.split("\n").map((line, i) => (
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
