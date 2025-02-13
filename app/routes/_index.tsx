import { cn } from "~/utils/css";
import styles from "./_index.module.css";

import { useFetcher } from "react-router";
import ItemFamily from "~/components/ItemFamily";
import { MapRepository } from "~/map/lifecycle";
import {
	serializeItemsToMarkdown,
	updateItemDescription,
} from "~/map/services";
import type { Route } from "./+types/_index";
import { DataStatus } from "./data-status";

export async function clientLoader() {
	console.debug("revalidated index");
	return await MapRepository.get();
}

export default function Page({ loaderData: items }: Route.ComponentProps) {
	const fetcher = useFetcher();
	const handleChangeDescription = (description: string, itemId: string) => {
		const newItems = updateItemDescription(itemId, description, items);
		fetcher.submit(
			{ markdownText: serializeItemsToMarkdown(newItems) },
			{ method: "POST", action: "/data-status" },
		);
	};

	return (
		<div className={cn(styles.bodyLayout, "bg-slate-200")}>
			<h1 className={cn(styles.title, "text-2xl text-slate-400 px-2")}>
				User Story Mapper
			</h1>
			<DataStatus currentMarkdownText={serializeItemsToMarkdown(items)} />
			<main className={cn(styles.main, "rounded-md bg-white shadow-md p-2")}>
				{items.map((item) => (
					<ItemFamily
						key={item.id}
						item={item}
						isParentExpanded
						onChangeDescription={handleChangeDescription}
					/>
				))}
			</main>
		</div>
	);
}
