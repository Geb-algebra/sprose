import { ClipboardCopyIcon } from "lucide-react";
import { toast } from "sonner";
import { TooltipButton } from "~/components/TooltipButton";
import { useKeyboardShortcut } from "~/hooks/useKeyboardShortcut";
import type { Item } from "~/map/models";
import { copyItemToClipboard } from "~/map/services/clipboard.client";

export default function ClipboardCopy(props: { map: Item }) {
	useKeyboardShortcut(["ctrl+c", "meta+c"], () => {
		copyItemToClipboard(props.map);
		toast("Copied to clipboard!");
	});
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
