import { cn } from "~/utils/css";
import styles from "./_index.module.css";

import ItemFamily from "~/components/ItemFamily";
import { MapRepository } from "~/map/lifecycle";
import { parseMarkdownToItems, serializeItemsToMarkdown } from "~/map/services";
import type { Route } from "./+types/_index";
import { DataStatus } from "./data-status";

export async function clientLoader() {
	return await MapRepository.get();
}

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const markdownFile = formData.get("markdownFile");
	if (!(markdownFile instanceof File)) {
		return { error: "Invalid file input, expected a File." };
	}
	const fileText = await markdownFile.text();
	await MapRepository.save(parseMarkdownToItems(fileText));
	return { success: true };
}

export default function Page({ loaderData: items }: Route.ComponentProps) {
	return (
		<div className={cn(styles.bodyLayout, "bg-slate-200")}>
			<h1 className={cn(styles.title, "text-2xl text-slate-400 px-2")}>
				User Story Mapper
			</h1>
			<DataStatus currentMarkdownText={serializeItemsToMarkdown(items)} />
			{/* <ImportMarkdownButton className={styles.fileUpload} />
			<ExportMarkdownButton className={styles.export} /> */}
			<main className={cn(styles.main, "rounded-md bg-white shadow-md p-2")}>
				{items.map((item) => (
					<ItemFamily key={item.id} item={item} isParentExpanded />
				))}
			</main>
		</div>
	);
}
