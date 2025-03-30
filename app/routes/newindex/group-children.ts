import type { Item } from "~/map/models";

export type ItemGroup = {
	type: "childless" | "parent";
	startSiblingIndex: number;
	items: Item[];
};

export function groupChildren(item: Item): ItemGroup[] {
	if (!item.children?.length) return [];

	const result: ItemGroup[] = [];
	let currentGroup: Item[] = [];
	let currentGroupStartIndex = 0;

	item.children.forEach((child, i) => {
		const hasChildren = child.children?.length > 0;
		const prevHasChildren = i > 0 && item.children[i - 1].children?.length > 0;

		if (hasChildren) {
			// If we've been building a group, add it to results first
			if (currentGroup.length) {
				result.push({
					type: "childless",
					startSiblingIndex: currentGroupStartIndex,
					items: [...currentGroup],
				});
				currentGroup = [];
			}
			result.push({
				type: "parent",
				startSiblingIndex: i,
				items: [child],
			});
		} else if (prevHasChildren) {
			currentGroup = [child];
			currentGroupStartIndex = i;
		} else {
			currentGroup.push(child);
		}
	});

	// Add any remaining items in the current group
	if (currentGroup.length) {
		result.push({
			type: "childless",
			startSiblingIndex: currentGroupStartIndex,
			items: currentGroup,
		});
	}

	return result;
}
