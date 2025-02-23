import { ArrowUpDownIcon, CheckIcon, DatabaseIcon, RefreshCw } from "lucide-react";
import React from "react";
import { useFetcher } from "react-router";
import { MapRepository } from "~/map/lifecycle";
import { type Item, itemSchema } from "~/map/models";
import { cn } from "~/utils/css";
import type { Route } from "./+types/data-status";
import styles from "./data-status.module.css";

export async function clientLoader() {
	return await MapRepository.get();
}

export async function clientAction({ request }: Route.ClientActionArgs) {
	// await new Promise((resolve) => setTimeout(resolve, 500));
	const item = itemSchema.parse(await request.json());
	return await MapRepository.save(item);
}

export function DataStatus(props: { currentItem: Item }) {
	const fetcher = useFetcher<typeof clientLoader>();
	const savedItem = fetcher.data;
	const isInSync = JSON.stringify(savedItem) === JSON.stringify(props.currentItem);

	React.useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (!isInSync) {
				fetcher.submit(props.currentItem, {
					method: "post",
					action: "/data-status",
					encType: "application/json",
				});
			}
		}, 2000);

		return () => clearTimeout(timeoutId);
	}, [isInSync, props.currentItem, fetcher]);
	return (
		<div className={cn(styles.layout, "-mb-5 z-1")}>
			<DatabaseIcon size={24} className={styles.database} />
			<div className={cn("flex items-center ml-2", styles.sync)}>
				<ArrowUpDownIcon size={18} />
				{isInSync ? (
					<CheckIcon size={10} className={styles.status} />
				) : (
					<RefreshCw
						size={10}
						className={cn(styles.status, fetcher.state !== "idle" ? "animate-spin" : "")}
					/>
				)}
			</div>
		</div>
	);
}
