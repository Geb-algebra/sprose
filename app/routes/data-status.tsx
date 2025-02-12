import * as localforage from "localforage";
import {
	ArrowRightIcon,
	ArrowUpDownIcon,
	CheckIcon,
	DatabaseIcon,
	RefreshCw,
} from "lucide-react";
import React from "react";
import { useFetcher } from "react-router";
import { ExportMarkdownButton } from "~/components/ExportMarkdownButton";
import { MapRepository } from "~/map/lifecycle";
import { parseMarkdownToItems, serializeItemsToMarkdown } from "~/map/services";
import { cn } from "~/utils/css";
import type { Route } from "./+types/data-status";
import styles from "./data-status.module.css";
import { ImportMarkdownButton } from "./import-markdown";

async function getMarkdownText() {
	const map = await MapRepository.get();
	const markdownText = serializeItemsToMarkdown(map);
	return { markdownText };
}

export async function clientLoader() {
	return await getMarkdownText();
}

export async function clientAction({ request }: Route.ClientActionArgs) {
	await new Promise((resolve) => setTimeout(resolve, 500));
	const formData = await request.formData();
	const markdownText = formData.get("markdownText");
	if (!(typeof markdownText === "string")) {
		throw new Error("Invalid markdown text input, expected a string.");
	}
	try {
		await MapRepository.save(parseMarkdownToItems(markdownText));
		return await getMarkdownText();
	} catch (error) {
		throw new Error(`Failed to save markdown text: ${error}`);
	}
}

export function DataStatus(props: { currentMarkdownText: string }) {
	const fetcher = useFetcher<typeof clientLoader>();
	const savedMarkdownText = fetcher.data?.markdownText;
	const isInSync = props.currentMarkdownText === savedMarkdownText;
	console.log("data", fetcher.data);
	React.useEffect(() => {
		const timeoutId = setTimeout(() => {
			console.log("sending");
			if (!isInSync) {
				const formData = new FormData();
				formData.append("markdownText", props.currentMarkdownText);
				fetcher.submit(formData, { method: "post", action: "/data-status" });
			}
		}, 2000);

		return () => clearTimeout(timeoutId);
	}, [isInSync, props.currentMarkdownText, fetcher]);
	return (
		<div className={cn(styles.layout, "-mb-5 z-1")}>
			<ImportMarkdownButton className={styles.import} />
			<ArrowRightIcon
				size={18}
				className={cn(styles.inarrow, "text-slate-400")}
			/>
			<DatabaseIcon size={24} className={styles.database} />
			<ArrowRightIcon
				size={18}
				className={cn(styles.exarrow, "text-slate-400")}
			/>
			<ExportMarkdownButton className={styles.export} />
			<div className={cn("flex items-center ml-2", styles.sync)}>
				<ArrowUpDownIcon size={18} />
				{isInSync ? (
					<CheckIcon size={10} className={styles.status} />
				) : (
					<RefreshCw
						size={10}
						className={cn(
							styles.status,
							fetcher.state !== "idle" ? "animate-spin" : "",
						)}
					/>
				)}
			</div>
		</div>
	);
}
