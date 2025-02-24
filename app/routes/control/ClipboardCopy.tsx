import { ClipboardCopyIcon } from "lucide-react";
import { TooltipButton } from "~/components/TooltipButton";
import { useKeyboardShortcut } from "~/hooks/useKeyboardShortcut";
import type { Item } from "~/map/models";
import { copyItemToClipboard } from "~/map/services/clipboard.client";

export default function ClipboardCopy(props: { map: Item }) {
	useKeyboardShortcut(["ctrl+c", "meta+c"], () => {
		copyItemToClipboard(props.map);
	});
	return (
		<TooltipButton
			type="button"
			variant="ghost"
			size="icon"
			onClick={() => copyItemToClipboard(props.map)}
			tooltip={`Paste from clipboard (${typeof window !== "undefined" && window.navigator.userAgent.includes("Mac") ? "⌘C" : "Ctrl+C"})`}
		>
			<ClipboardCopyIcon />
		</TooltipButton>
	);
}
