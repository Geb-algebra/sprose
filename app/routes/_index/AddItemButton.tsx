import React from "react";
import { BlurOnEnterTextArea } from "~/components/BlurOnEnterTextArea";
import { createNewItem } from "~/map/lifecycle";
import type { Item } from "~/map/models";
import { cardShape, cn, focusVisibleStyle } from "~/utils/css";
import styles from "./AddItemButton.module.css";

export function AddItemButton(props: {
	parent: Item;
	className?: string;
	addItem: (item: Item) => void;
	moveItem: (movedItemId: string, targetParentId: string, targetSiblingIndex: number) => void;
}) {
	const [writing, setWriting] = React.useState(false);
	const addButton = React.useRef<HTMLButtonElement | null>(null);
	return (
		<div className={cn(props.className, "px-2 py-1")}>
			{writing ? (
				<BlurOnEnterTextArea
					className={cn(
						"grid place-content-center bg-card p-2 text-sm resize-none",
						cardShape,
						focusVisibleStyle,
					)}
					onBlur={(e) => {
						if (e.target.value.trim() !== "") {
							props.addItem(createNewItem(e.target.value));
						}
						setWriting(false);
					}}
					nextElement={addButton.current}
				/>
			) : (
				<button
					ref={addButton}
					type="button"
					onClick={() => {
						setWriting(true);
					}}
					className={cn(
						"rounded-lg grid place-content-center bg-transparent transition-colors outline-none",
						cardShape,
						"border-2 border-border/50 border-dashed hover:border-ring focus-visible:border-ring",
						"text-2xl text-border/50 hover:text-ring focus-visible:text-ring",
					)}
				>
					+
				</button>
			)}
		</div>
	);
}
