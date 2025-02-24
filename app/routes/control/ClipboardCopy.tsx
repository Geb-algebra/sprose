import { ClipboardCopyIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { TooltipButton } from "~/components/TooltipButton";
import type { Item } from "~/map/models";
import { copyItemToClipboard } from "~/map/services/clipboard.client";

export default function ClipboardCopy(props: { map: Item }) {
	React.useEffect(() => {
		const handler = (e: ClipboardEvent) => {
			const activeEl = document.activeElement;
			if (activeEl && activeEl !== document.body && activeEl.tagName !== "HTML") {
				return;
			}
			copyItemToClipboard(props.map);
			toast("Copied to clipboard!");
		};
		document.addEventListener("copy", handler);
		return () => document.removeEventListener("copy", handler);
	}, [props.map]);

	return (
		<TooltipButton
			type="button"
			variant="ghost"
			size="icon"
			onClick={() => {
				copyItemToClipboard(props.map);
				toast("Copied to clipboard!");
			}}
			tooltip={`Paste from clipboard (${typeof window !== "undefined" && window.navigator.userAgent.includes("Mac") ? "⌘C" : "Ctrl+C"})`}
		>
			<ClipboardCopyIcon />
		</TooltipButton>
	);
}
