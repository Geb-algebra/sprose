import { DownloadIcon, UploadIcon } from "lucide-react";
import { Button } from "~/components/atoms/Button";
import { cn } from "~/utils/css";
import styles from "./_index.module.css";

import ItemFamily from "~/components/molecules/ItemFamily";
import type { Item } from "~/models";
import type { Route } from "./+types/_index";

export function clientLoader({}: Route.ClientLoaderArgs) {
	return {
		id: "1",
		description: "Item 1",
		children: [
			{
				id: "2",
				description: "Item 2",
				children: [
					{
						id: "5",
						description: "Item 5",
						children: [],
					},
					{
						id: "6",
						description: "Item 6",
						children: [],
					},
				],
			},
			{
				id: "3",
				description: "Item 3",
				children: [],
			},
			{
				id: "4",
				description: "Item 4",
				children: [
					{
						id: "7",
						description: "Item 7",
						children: [],
					},
				],
			},
		],
	} as Item;
}

export default function Page({ loaderData }: Route.ComponentProps) {
	return (
		<div className={cn(styles.bodyLayout, "bg-slate-200")}>
			<h1 className={cn(styles.title, "text-2xl text-slate-400 px-2")}>
				My User Story Map
			</h1>
			<Button
				type="button"
				className={cn(styles.fileUpload)}
				variant="default"
				size="icon"
			>
				<UploadIcon />
			</Button>
			<Button
				type="button"
				className={cn(styles.export)}
				variant="default"
				size="icon"
			>
				<DownloadIcon />
			</Button>
			<main className={cn(styles.main, "rounded-md bg-white shadow-md p-2")}>
				<ItemFamily item={loaderData} />
			</main>
		</div>
	);
}
