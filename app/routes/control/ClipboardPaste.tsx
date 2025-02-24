import { ClipboardPasteIcon } from "lucide-react";
import { useRef } from "react";
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
import { useKeyboardShortcut } from "~/hooks/useKeyboardShortcut";
import type { Item } from "~/map/models";
import { getChildFromClipboard } from "~/map/services/clipboard.client";

export default function ClipboardPaste(props: { map: Item }) {
	const fetcher = useFetcher();

	const dialogTriggerRef = useRef<HTMLButtonElement>(null);

	useKeyboardShortcut(
		["ctrl+v", "meta+v"],
		() => {
			dialogTriggerRef.current?.click();
		},
		(e) => e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement,
	);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<TooltipButton
					ref={dialogTriggerRef}
					type="button"
					variant="ghost"
					size="icon"
					tooltip="Paste from clipboard"
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
