import type { Item } from "~/map/models";

export type ItemGroup = {
	type: "childless" | "parent";
	startSiblingIndex: number;
	/** Index marking the start of the next group, or the total number of children if this is the last group. */
	nextStartSiblingIndex: number;
};

/**
 * Groups the children of an item into segments.
 * Consecutive children without their own children are grouped into "childless" segments.
 * Children that have their own children AND are expanded form individual "parent" segments.
 * Children with children that are not expanded are treated as "childless".
 *
 * @param item The parent item whose children are to be grouped.
 * @returns An array of ItemGroup objects representing the segments.
 */
export function groupChildren(item: Item): ItemGroup[] {
	const result: ItemGroup[] = [];

	if (!item.children || item.children.length === 0) {
		return result;
	}

	let currentIndex = 0;
	let childlessStartIndex = -1;

	while (currentIndex < item.children.length) {
		const child = item.children[currentIndex];

		// If the current child has children AND is expanded, it forms a "parent" group
		if (child.children && child.children.length > 0 && child.isExpanded) {
			// If we have started a childless segment, close it before adding a parent segment
			if (childlessStartIndex !== -1) {
				result.push({
					type: "childless",
					startSiblingIndex: childlessStartIndex,
					nextStartSiblingIndex: currentIndex,
				});
				childlessStartIndex = -1;
			}

			// Add the parent segment
			result.push({
				type: "parent",
				startSiblingIndex: currentIndex,
				nextStartSiblingIndex: currentIndex + 1,
			});
		} else {
			// If this is the first childless item in a potential sequence, mark its position
			if (childlessStartIndex === -1) {
				childlessStartIndex = currentIndex;
			}
		}

		currentIndex++;
	}

	// If we have an open childless segment at the end, close it
	if (childlessStartIndex !== -1) {
		result.push({
			type: "childless",
			startSiblingIndex: childlessStartIndex,
			nextStartSiblingIndex: item.children.length,
		});
	}

	return result;
}
