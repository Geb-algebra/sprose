import React from "react";
import { useFetcher } from "react-router";
import { BlurOnEnterTextArea } from "~/components/BlurOnEnterTextArea";
import { useAcceptCardInsert } from "~/map/hooks/useCardInsert";
import { createNewItem } from "~/map/lifecycle";
import type { Item } from "~/map/models";
import { cardShape, cn, focusVisibleStyle, inserterShape } from "~/utils/css";
import styles from "./AddItemButton.module.css";

export function AddItemButton(props: {
	parent: Item;
	className?: string;
	addItem: (item: Item) => void;
	moveItem: (movedItemId: string, targetParentId: string, targetSiblingIndex: number) => void;
}) {
	const [writing, setWriting] = React.useState(false);
	const { insertAt, onDragOver, onDragLeave, onDrop } = useAcceptCardInsert(
		props.parent,
		props.parent.children.length,
		() => "before",
		props.moveItem,
	);

	const addButton = React.useRef<HTMLButtonElement | null>(null);
	return (
		<div
			className={cn(
				props.className,
				props.parent.isExpanded ? styles.expandedLayout : styles.collapsedLayout,
			)}
			onDragOver={onDragOver}
			onDragLeave={onDragLeave}
			onDrop={onDrop}
		>
			<div
				className={cn(
					inserterShape(props.parent.isExpanded),
					insertAt !== "before" && "hidden",
					"bg-secondary rounded-lg",
				)}
			/>
			{writing ? (
				<BlurOnEnterTextArea
					className={cn(
						"grid place-content-center bg-card p-2 text-sm resize-none",
						cardShape,
						"h-20",
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
			) : null}
			{props.parent.id === "__root" ? (
				<button
					ref={addButton}
					type="button"
					onClick={() => {
						setWriting(true);
					}}
					className={cn(
						"rounded-lg grid place-content-center bg-transparent transition-colors outline-none",
						cardShape,
						"h-20",
						"border-2 border-border/50 border-dashed hover:border-ring focus-visible:border-ring",
						"text-2xl text-border/50 hover:text-ring focus-visible:text-ring",
					)}
				>
					+
				</button>
			) : (
				<div className={cn(inserterShape(props.parent.isExpanded))}>
					<button
						ref={addButton}
						type="button"
						onClick={() => {
							setWriting(true);
						}}
						className={cn(
							"w-full h-full rounded-lg grid place-content-center bg-transparent transition-colors outline-none",
							"border-2 border-border/50 border-dashed hover:border-ring focus-visible:border-ring",
							"text-2xl text-border/50 hover:text-ring focus-visible:text-ring",
						)}
					>
						+
					</button>
				</div>
			)}
		</div>
	);
}
