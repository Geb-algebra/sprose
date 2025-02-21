import { RedoIcon, UndoIcon } from "lucide-react";
import { useFetcher } from "react-router";
import { TooltipButton } from "~/components/TooltipButton";
import { MapRepository } from "~/map/lifecycle";
import { cn } from "~/utils/css";
import type { Route } from "./+types/control";

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
		<div className={cn(props.className, "flex bg-card shadow-sm rounded-lg w-fit p-1")}>
			<fetcher.Form action="/control" method="post" className="flex w-fit">
				<TooltipButton
					type="submit"
					name="action"
					variant="ghost"
					size="icon"
					value="undo"
					tooltip="Undo"
				>
					<UndoIcon size={24} />
				</TooltipButton>
				<TooltipButton
					type="submit"
					name="action"
					variant="ghost"
					size="icon"
					value="redo"
					tooltip="Redo"
				>
					<RedoIcon size={24} />
				</TooltipButton>
			</fetcher.Form>
		</div>
	);
}
