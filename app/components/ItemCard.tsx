import type { Item } from "~/map/models";
import { cn, focusVisibleStyle } from "~/utils/css";
import styles from "./ItemCard.module.css";

function PseudoCard(props: { className?: string }) {
	return (
		<div
			className={cn(
				props.className,
				"w-48 h-16 shadow-sm bg-slate-100 rounded-md p-2",
			)}
		/>
	);
}

export default function ItemCard(props: {
	item: Item;
	onChangeDescription: (description: string, itemId: string) => void;
	isStacked: boolean;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"w-[200px] h-[72px] relative",
				props.className,
				styles.layout,
			)}
		>
			<textarea
				className={cn(
					styles.content,
					focusVisibleStyle,
					"absolute top-0 left-0 z-20 w-48 h-16 bg-slate-100 shadow-sm rounded-md p-2 text-sm mb-2 mr-2 resize-none",
				)}
				defaultValue={props.item.description}
				onBlur={(e) => {
					props.onChangeDescription(e.target.value, props.item.id);
				}}
			/>
			{props.isStacked ? (
				<>
					<PseudoCard className="absolute top-[2px] left-[2px] z-10" />
					<PseudoCard className="absolute top-[4px] left-[4px] z-5" />
				</>
			) : null}
		</div>
	);
}
