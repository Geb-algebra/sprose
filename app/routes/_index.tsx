import { cn } from "~/utils/css";
import styles from "./_index.module.css";

import { useFetcher } from "react-router";
import ItemFamily from "~/components/ItemFamily";
import { MapRepository, createNewItem } from "~/map/lifecycle";
import type { Item } from "~/map/models";
import {
	addNewItem,
	deleteItem,
	serializeMapToMarkdown,
	updateItemDescription,
} from "~/map/services";
import type { Route } from "./+types/_index";
import { DataStatus } from "./data-status";

export async function clientLoader() {
	console.debug("revalidated index");
	return await MapRepository.get();
}

export default function Page({ loaderData: map }: Route.ComponentProps) {
	const fetcher = useFetcher();
	const handleChangeDescription = (description: string, itemId: string) => {
		let newMap: Item;
		if (description.trim() === "") {
			newMap = deleteItem(itemId, map);
		} else {
			newMap = updateItemDescription(map, itemId, description);
		}
		fetcher.submit(newMap, {
			method: "POST",
			action: "/data-status",
			encType: "application/json",
		});
	};
	const handleAddItem = async (parentId: string, description: string) => {
		const newItem = createNewItem(description);
		const newMap = addNewItem(parentId, map, newItem);
		await fetcher.submit(newMap, {
			method: "POST",
			action: "/data-status",
			encType: "application/json",
		});
		document.getElementById(newItem.id)?.focus();
	};

	return (
		<div className={cn(styles.bodyLayout, "bg-slate-200")}>
			<h1 className={cn(styles.title, "text-2xl text-slate-400 px-2")}>
				User Story Mapper
			</h1>
			<DataStatus currentItem={map} />
			<main
				className={cn(
					styles.main,
					"rounded-md bg-white shadow-md p-2 overflow-auto",
				)}
			>
				{map.children.map((item) => (
					<ItemFamily
						key={item.id}
						item={item}
						isParentExpanded
						onChangeDescription={handleChangeDescription}
						onFinishWritingNewItem={handleAddItem}
					/>
				))}
			</main>
		</div>
	);
}
