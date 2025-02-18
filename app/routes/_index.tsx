import { cn } from "~/utils/css";
import styles from "./_index.module.css";

import { useFetcher } from "react-router";
import Logo from "~/components/Logo";
import { MapRepository } from "~/map/lifecycle";
import { ItemFamily } from "~/routes/item-family.$id";
import type { Route } from "./+types/_index";
import { AddItemCardButton } from "./add-item.$parentId";
import { Control } from "./control";

export async function clientLoader() {
	console.debug("revalidated index");
	return await MapRepository.get();
}

export default function Page({ loaderData: map }: Route.ComponentProps) {
	const fetcher = useFetcher();

	return (
		<div className={cn(styles.bodyLayout, "bg-secondary")}>
			<h1
				className={cn(
					styles.title,
					"text-2xl px-2 grid justify-start items-center grid-flow-col gap-2 text-primary",
				)}
			>
				<Logo fill="var(--primary)" size={42} />
				Sprose
			</h1>
			<Control className={styles.control} />
			<main
				className={cn(
					styles.main,
					styles.mainLayout,
					"rounded-2xl bg-background shadow-md p-2 overflow-auto",
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
