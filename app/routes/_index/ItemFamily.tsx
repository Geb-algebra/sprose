import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useContext } from "react";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "~/components/ContextMenu";
import { TooltipButton } from "~/components/TooltipButton";
import { useKeyboardShortcut } from "~/hooks/useKeyboardShortcut";
import type { Item } from "~/map/models";
import { copyItemToClipboard, getChildFromClipboard } from "~/map/services/clipboard.client";
import { HorizontalDropAcceptor, VerticalDropAcceptor } from "~/routes/_index/DragDrop";
import { cn } from "~/utils/css";
import { ChildrenBox } from "./ChildrenBox";
import { ItemCard } from "./Item";
import { mapControllerContext } from "./context";
import { groupChildren } from "./group-children";

export function ItemFamily(props: {
	parent: Item;
	siblingIndex: number;
	className?: string;
}) {
	const item = props.parent.children[props.siblingIndex];
	const { toggleExpand, updateChildren, removeItem } = useContext(mapControllerContext);

	useKeyboardShortcut(["ctrl+e", "meta+e"], (e) => {
		if (
			document.activeElement &&
			document.getElementById(item.id)?.contains(document.activeElement)
		) {
			toggleExpand(item);
		}
	});

	const DropAcceptor = item.isExpanded ? HorizontalDropAcceptor : VerticalDropAcceptor;

	return (
		<ContextMenu>
			<DropAcceptor
				parent={props.parent}
				siblingIndex={props.siblingIndex}
				className={cn(props.className, "mx-1")}
				disabledInsertAt={item.isExpanded ? ["into"] : []}
			>
				<ContextMenuTrigger>
					<div className="grid">
						<div
							className={cn(
								"w-full h-full flex rounded-lg border shadow-sm items-start relative bg-parent-card",
								item.isExpanded && "h-[150%] rounded-b-none",
							)}
						>
							<ItemCard
								parent={props.parent}
								siblingIndex={props.siblingIndex}
								className={cn("sticky left-0 border-none shadow-none")}
								asParent={true}
							/>
							<TooltipButton
								type="button"
								variant="ghost"
								size="icon"
								className={cn("w-4 h-9 ml-auto sticky right-0")}
								disabled={item.children.length === 0}
								onClick={() => toggleExpand(item)}
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
											/>
										);
									}
									return (
										<ChildrenBox
											key={group.startSiblingIndex}
											parent={item}
											startSiblingIndex={group.startSiblingIndex}
											nextStartSiblingIndex={group.nextStartSiblingIndex}
										/>
									);
								})}
							</div>
						) : null}
					</div>
				</ContextMenuTrigger>
			</DropAcceptor>
			<ContextMenuContent className="w-64">
				<ContextMenuItem
					onClick={() => {
						const newChildren = item.children.map((child) => ({ ...child, isExpanded: false }));
						updateChildren(item, newChildren);
					}}
				>
					Collapse All Children
				</ContextMenuItem>
				<ContextMenuItem
					onClick={() => {
						const newChildren = item.children.map((child) => ({ ...child, isExpanded: true }));
						updateChildren(item, newChildren);
					}}
				>
					Expand All Children
				</ContextMenuItem>
				<ContextMenuItem onClick={() => copyItemToClipboard(item)}>
					Copy Markdown List
				</ContextMenuItem>
				<ContextMenuItem
					onClick={async () => {
						const newChildren = await getChildFromClipboard();
						if (newChildren) {
							updateChildren(item, [...item.children, ...newChildren]);
						}
					}}
				>
					Paste Markdown List as Child
				</ContextMenuItem>
				<ContextMenuItem
					className="text-destructive focus:bg-destructive-foreground"
					onClick={() => removeItem(item)}
				>
					Delete
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
