import { RedoIcon, UndoIcon } from "lucide-react";
import { Form, useFetcher } from "react-router";
import { Button } from "~/components/Button";
import { ExportMarkdownButton } from "~/components/ExportMarkdownButton";
import { MapRepository } from "~/map/lifecycle";
import { cn } from "~/utils/css";
import type { Route } from "./+types/control";
import { ImportMarkdownButton } from "./import-markdown";

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const action = formData.get("action");
	if (action === "undo") {
		await MapRepository.undo();
	} else if (action === "redo") {
		await MapRepository.redo();
	}
}

export function Control(props: { className?: string }) {
	const fetcher = useFetcher();
	return (
		<div
			className={cn(
				props.className,
				"flex gap-2 bg-card shadow-sm rounded-md w-fit p-2",
			)}
		>
			<fetcher.Form
				action="/control"
				method="post"
				className="flex gap-2 w-fit"
			>
				<Button
					type="submit"
					name="action"
					variant="ghost"
					size="icon"
					value="undo"
				>
					<UndoIcon size={24} />
				</Button>
				<Button
					type="submit"
					name="action"
					variant="ghost"
					size="icon"
					value="redo"
				>
					<RedoIcon size={24} />
				</Button>
			</fetcher.Form>
			<ImportMarkdownButton />
			<ExportMarkdownButton />
		</div>
	);
}
