import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useFetcher } from "react-router";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "~/components/ContextMenu";
import { HorizontalDropAcceptor, VerticalDropAcceptor } from "~/components/DragDrop";
import { TooltipButton } from "~/components/TooltipButton";
import { useKeyboardShortcut } from "~/hooks/useKeyboardShortcut";
import { type Item, itemSchema } from "~/map/models";
import { copyItemToClipboard, getChildFromClipboard } from "~/map/services/clipboard.client";
import { cn, inserterShape } from "~/utils/css";
import { AddItemButton } from "./AddItemButton";
import { ChildrenBox } from "./ChildrenBox";
import { ItemCard } from "./Item";
import { groupChildren } from "./group-children";

export function ItemFamily(props: {
	parent: Item;
	siblingIndex: number;
	className?: string;
	moveItem: (movedItemId: string, targetParentId: string, targetSiblingIndex: number) => void;
}) {
	const fetcher = useFetcher();
	function submitJson(newItem: Item, method: "PUT" | "DELETE") {
		fetcher.submit(newItem, {
			method,
			encType: "application/json",
		});
	}
	const possiblyNewItem = itemSchema.safeParse(fetcher.json);
	const item = possiblyNewItem.success
		? possiblyNewItem.data
		: props.parent.children[props.siblingIndex];

	useKeyboardShortcut(["ctrl+e", "meta+e"], (e) => {
		if (
			document.activeElement &&
			document.getElementById(item.id)?.contains(document.activeElement)
		) {
			submitJson({ ...item, isExpanded: !item.isExpanded }, "PUT");
		}
	});

	const DropAcceptor = item.isExpanded ? HorizontalDropAcceptor : VerticalDropAcceptor;

	return (
		<ContextMenu>
			<DropAcceptor
				parent={props.parent}
				siblingIndex={props.siblingIndex}
				moveItem={props.moveItem}
				className={cn(props.className, "mx-1")}
				disabledInsertAt={item.isExpanded ? ["into"] : []}
			>
				<ContextMenuTrigger>
					<div className="grid">
						<div
							className={cn(
								"w-full h-full flex rounded-lg border shadow-sm items-start relative bg-parent-card",
								item.isExpanded && "h-[120%] rounded-b-none",
							)}
						>
							<ItemCard
								parent={props.parent}
								siblingIndex={props.siblingIndex}
								moveItem={props.moveItem}
								className={cn("sticky left-0 border-none shadow-none")}
								asParent={true}
							/>
							<TooltipButton
								type="button"
								variant="ghost"
								size="icon"
								className={cn("w-4 h-9 ml-auto")}
								disabled={item.children.length === 0}
								onClick={() => submitJson({ ...item, isExpanded: !item.isExpanded }, "PUT")}
								tooltip={`${item.isExpanded ? "Collapse" : "Expand"} (${typeof window !== "undefined" && window.navigator.userAgent.includes("Mac") ? "⌘E" : "Ctrl+E"} when focused)`}
							>
								{item.children.length === 0 ? null : item.isExpanded ? (
									<ChevronLeftIcon />
								) : (
									<ChevronRightIcon />
								)}
							</TooltipButton>
						</div>
						{item.isExpanded ? (
							<div
								className={cn(
									"flex py-1 rounded-xl border-x border-t inset-shadow-sm bg-background z-10",
								)}
							>
								{groupChildren(item).map((group) => {
									if (group.type === "parent") {
										return (
											<ItemFamily
												key={group.startSiblingIndex}
												parent={item}
												siblingIndex={group.startSiblingIndex}
												moveItem={props.moveItem}
											/>
										);
									}
									return (
										<ChildrenBox
											key={group.startSiblingIndex}
											parent={item}
											startSiblingIndex={group.startSiblingIndex}
											nextStartSiblingIndex={group.nextStartSiblingIndex}
											moveItem={props.moveItem}
										/>
									);
								})}
							</div>
						) : null}
					</div>
				</ContextMenuTrigger>
			</DropAcceptor>
			<ContextMenuContent className="w-64">
				<ContextMenuItem onClick={() => copyItemToClipboard(item)}>
					Copy as Markdown List
				</ContextMenuItem>
				<ContextMenuItem
					onClick={async () => {
						const newChildren = await getChildFromClipboard();
						if (newChildren) {
							submitJson({ ...item, children: [...item.children, ...newChildren] }, "PUT");
						}
					}}
				>
					Paste Markdown List as Child
				</ContextMenuItem>
				<ContextMenuItem
					className="text-destructive focus:bg-destructive-foreground"
					onClick={() => submitJson(item, "DELETE")}
				>
					Delete
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
