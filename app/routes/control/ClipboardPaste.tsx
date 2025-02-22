import { ClipboardPasteIcon } from "lucide-react";
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
	return (
		<Dialog>
			<DialogTrigger asChild>
				<TooltipButton type="button" variant="ghost" size="icon" tooltip="Paste from clipboard">
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
