import { useFetcher } from "react-router";
import { MapRepository } from "~/map/lifecycle";
import type { Item } from "~/map/models";
import { deleteItem, updateItem } from "~/map/services";
import { cn, focusVisibleStyle } from "~/utils/css";
import type { Route } from "./+types/item.$id";
import styles from "./item.$id.module.css";

export async function clientAction({
	request,
	params,
}: Route.ClientActionArgs) {
	const { id } = params;
	const formData = await request.formData();
	const newDescription = formData.get("description");
	if (typeof newDescription !== "string") {
		throw new Error("Invalid description");
	}
	const map = await MapRepository.get();

	let newMap: Item;
	if (newDescription.trim() === "") {
		newMap = deleteItem(id, map);
	} else {
		newMap = updateItem(map, { id, description: newDescription });
	}
	await MapRepository.save(newMap);
	return null;
}

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

export function ItemCard(props: {
	item: Item;
	className?: string;
	isStacked?: boolean;
}) {
	const fetcher = useFetcher();

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
				// optimistic description update
				defaultValue={
					// (fetcher.formData?.get("description") as string) ??
					props.item.description
				}
				onBlur={(e) => {
					fetcher.submit(
						{ description: e.target.value },
						{ method: "post", action: `/item/${props.item.id}` },
					);
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
