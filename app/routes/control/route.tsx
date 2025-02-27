import { RedoIcon, UndoIcon } from "lucide-react";
import { useFetcher } from "react-router";
import { TooltipButton } from "~/components/TooltipButton";
import { useKeyboardShortcut } from "~/hooks/useKeyboardShortcut";
import { MapRepository } from "~/map/lifecycle";
import type { Item } from "~/map/models";
import { cn } from "~/utils/css";
import type { Route } from "./+types/route";
import ClipboardCopy from "./ClipboardCopy";
import ClipboardPaste from "./ClipboardPaste";
import Delete from "./Delete";

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const action = formData.get("action");
	if (action === "undo") {
		await MapRepository.undo();
	} else if (action === "redo") {
		await MapRepository.redo();
	}
}

export function Control(props: { map: Item; className?: string }) {
	const fetcher = useFetcher();

	useKeyboardShortcut(
		["ctrl+z", "meta+z"],
		() => {
			fetcher.submit({ action: "undo" }, { method: "post", action: "/control" });
		},
		(e) => e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement,
	);

	useKeyboardShortcut(
		["ctrl+shift+z", "meta+shift+z"],
		() => {
			fetcher.submit({ action: "redo" }, { method: "post", action: "/control" });
		},
		(e) => e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement,
	);

	return (
		<div className={cn(props.className, "flex bg-card shadow-sm rounded-lg w-fit p-1")}>
			<fetcher.Form action="/control" method="post" className="flex w-fit">
				<TooltipButton
					type="submit"
					name="action"
					variant="ghost"
					size="icon"
					value="undo"
					tooltip={`Undo (${typeof window !== "undefined" && window.navigator.userAgent.includes("Mac") ? "⌘Z" : "Ctrl+Z"})`}
				>
					<UndoIcon />
				</TooltipButton>
				<TooltipButton
					type="submit"
					name="action"
					variant="ghost"
					size="icon"
					value="redo"
					tooltip={`Redo (${typeof window !== "undefined" && window.navigator.userAgent.includes("Mac") ? "⌘⇧Z" : "Ctrl+Shift+Z"})`}
				>
					<RedoIcon />
				</TooltipButton>
			</fetcher.Form>
			<ClipboardCopy map={props.map} />
			<ClipboardPaste map={props.map} />
			<Delete map={props.map} />
		</div>
	);
}
