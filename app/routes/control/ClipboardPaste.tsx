import { ClipboardPasteIcon } from "lucide-react";
import React, { useRef } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/components/Button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/Dialog";
import { TooltipButton } from "~/components/TooltipButton";
import type { Item } from "~/map/models";
import { getChildFromClipboard } from "~/map/services/clipboard.client";

export default function ClipboardPaste(props: { map: Item }) {
	const fetcher = useFetcher();
	const [open, setOpen] = React.useState(false);

	const dialogTriggerRef = useRef<HTMLButtonElement>(null);

	React.useEffect(() => {
		const handler = (e: ClipboardEvent) => {
			const activeEl = document.activeElement;
			if (activeEl && activeEl !== document.body && activeEl.tagName !== "HTML") {
				return;
			}
			setOpen(true);
		};
		document.addEventListener("paste", handler);
		return () => document.removeEventListener("paste", handler);
	}, []);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<TooltipButton
					ref={dialogTriggerRef}
					type="button"
					variant="ghost"
					size="icon"
					tooltip={`Paste from clipboard (${typeof window !== "undefined" && window.navigator.userAgent.includes("Mac") ? "⌘V" : "Ctrl+V"})`}
				>
					<ClipboardPasteIcon />
				</TooltipButton>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Caution</DialogTitle>
					<DialogDescription>
						All the current content will be replaced by your clipboard content.
					</DialogDescription>
				</DialogHeader>
				<DialogClose asChild>
					<Button
						variant="destructive"
						onClick={async () => {
							const newChildren = await getChildFromClipboard();
							if (newChildren) {
								fetcher.submit(
									{
										...props.map,
										children: [...newChildren],
									},
									{
										method: "PUT",
										encType: "application/json",
									},
								);
							}
						}}
					>
						Paste
					</Button>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
}
