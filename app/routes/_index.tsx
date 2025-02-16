import { cn } from "~/utils/css";
import styles from "./_index.module.css";

import { useFetcher } from "react-router";
import { MapRepository } from "~/map/lifecycle";
import { ItemFamily } from "~/routes/item-family.$id";
import type { Route } from "./+types/_index";
import { AddItemCardButton } from "./add-item.$parentId";
import { DataStatus } from "./data-status";

export async function clientLoader() {
	console.debug("revalidated index");
	return await MapRepository.get();
}

export default function Page({ loaderData: map }: Route.ComponentProps) {
	const fetcher = useFetcher();

	return (
		<div className={cn(styles.bodyLayout, "bg-slate-200")}>
			<h1 className={cn(styles.title, "text-2xl text-slate-400 px-2")}>
				Exporg
			</h1>
			<DataStatus currentItem={map} />
			<main
				className={cn(
					styles.main,
					styles.mainLayout,
					"rounded-md bg-white shadow-md p-2 overflow-auto",
				)}
			>
				{map.children.map((item, siblingIndex) => (
					<ItemFamily key={item.id} parent={map} siblingIndex={siblingIndex} />
				))}
				<AddItemCardButton parent={map} />
			</main>
		</div>
	);
}
