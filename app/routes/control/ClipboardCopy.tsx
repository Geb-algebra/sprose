import { ClipboardCopyIcon } from "lucide-react";
import React from "react";
import { TooltipButton } from "~/components/TooltipButton";
import type { Item } from "~/map/models";
import { copyItemToClipboard } from "~/map/services/clipboard.client";

export default function ClipboardCopy(props: { map: Item }) {
	return (
		<TooltipButton
			type="button"
			variant="ghost"
			size="icon"
			onClick={() => copyItemToClipboard(props.map)}
			tooltip="Copy to clipboard"
		>
			<ClipboardCopyIcon />
		</TooltipButton>
	);
}
