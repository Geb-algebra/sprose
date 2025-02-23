import { ClipboardPasteIcon, TrashIcon } from "lucide-react";
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
				<TooltipButton type="button" variant="destructiveGhost" size="icon" tooltip="Delete all">
					<TrashIcon />
				</TooltipButton>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Caution</DialogTitle>
					<DialogDescription>All the current content will be deleted.</DialogDescription>
				</DialogHeader>
				<DialogClose asChild>
					<Button
						variant="destructive"
						onClick={async () => {
							fetcher.submit(
								{
									...props.map,
									children: [],
								},
								{
									method: "PUT",
									encType: "application/json",
								},
							);
						}}
					>
						Delete
					</Button>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
}
