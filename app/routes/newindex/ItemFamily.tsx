import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useFetcher } from "react-router";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "~/components/ContextMenu";
import { DropAcceptor } from "~/components/DragDrop";
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

	return (
		<ContextMenu>
			<DropAcceptor
				parent={props.parent}
				siblingIndex={props.siblingIndex}
				moveItem={props.moveItem}
			>
				<ContextMenuTrigger>
					{!props.parent.isExpanded ? (
						<ItemCard
							parent={props.parent}
							siblingIndex={props.siblingIndex}
							moveItem={props.moveItem}
						/>
					) : (
						<div>
							<div
								className={cn(
									"bg-card h-[120%] w-full flex rounded-t-lg border shadow-sm items-start relative",
								)}
							>
								<ItemCard
									parent={props.parent}
									siblingIndex={props.siblingIndex}
									moveItem={props.moveItem}
									className={cn("sticky left-0 border-none shadow-none")}
								/>
								<TooltipButton
									type="button"
									variant="ghost"
									size="icon"
									className={cn("w-4 h-20 ml-auto")}
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
							<div
								className={cn(
									"flex p-2 rounded-xl border-x border-t inset-shadow-xs bg-background z-10",
								)}
							>
								{groupChildren(item).map((group) => {
									console.log(group);
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
										<ChildrenBox key={group.startSiblingIndex}>
											{group.items.map((child, index) => (
												<ItemCard
													key={child.id}
													parent={item}
													siblingIndex={group.startSiblingIndex + index}
													moveItem={props.moveItem}
												/>
											))}
											<AddItemButton
												parent={props.parent}
												addItem={(addedChild: Item) => {
													submitJson({ ...item, children: [...item.children, addedChild] }, "PUT");
												}}
												moveItem={() => {}}
											/>
										</ChildrenBox>
									);
								})}
							</div>
						</div>
					)}
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
