import type { Item } from "~/models";
import { cn } from "~/utils/css";

export default function ItemCard(props: { item: Item; className?: string }) {
	return (
		<div
			className={cn(
				"w-48 h-16 rounded-b-md bg-slate-100 shadow-sm grid place-items-center",
				props.className,
			)}
		>
			{props.item.description}
		</div>
	);
}
