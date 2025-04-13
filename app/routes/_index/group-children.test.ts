import { describe, expect, it } from "vitest";
import { createNewItem } from "~/map/lifecycle";
import { parseMarkdownToItem } from "~/map/services";
import { _item } from "~/map/services/test-utils";
import { groupChildren } from "./group-children";

describe("groupChildren", () => {
	it("split the children of an item with children with child", () => {
		const grouped = groupChildren(
			_item({
				children: [
					_item({}),
					_item({}),
					_item({
						isExpanded: true,
						children: [_item({})],
					}),
					_item({}),
					_item({
						isExpanded: true,
						children: [_item({})],
					}),
					_item({}),
					_item({}),
					_item({}),
				],
			}),
		);
		expect(grouped.length).toBe(5);

		expect(grouped[0].type).toBe("childless");
		expect(grouped[0].startSiblingIndex).toBe(0);
		expect(grouped[0].nextStartSiblingIndex).toBe(2);

		expect(grouped[1].type).toBe("parent");
		expect(grouped[1].startSiblingIndex).toBe(2);
		expect(grouped[1].nextStartSiblingIndex).toBe(3);

		expect(grouped[2].type).toBe("childless");
		expect(grouped[2].startSiblingIndex).toBe(3);
		expect(grouped[2].nextStartSiblingIndex).toBe(4);

		expect(grouped[3].type).toBe("parent");
		expect(grouped[3].startSiblingIndex).toBe(4);
		expect(grouped[3].nextStartSiblingIndex).toBe(5);

		expect(grouped[4].type).toBe("childless");
		expect(grouped[4].startSiblingIndex).toBe(5);
		expect(grouped[4].nextStartSiblingIndex).toBe(8);
	});

	it("split the children of an item where the first child has children", () => {
		const grouped = groupChildren(
			parseMarkdownToItem(`
- Item 1
  - Item 1.1
- Item 2
- Item 3
  - Item 3.1
- Item 4
- Item 5
`),
		);
		expect(grouped.length).toBe(4);

		expect(grouped[0].type).toBe("parent");
		expect(grouped[0].startSiblingIndex).toBe(0);
		expect(grouped[0].nextStartSiblingIndex).toBe(1);

		expect(grouped[1].type).toBe("childless");
		expect(grouped[1].startSiblingIndex).toBe(1);
		expect(grouped[1].nextStartSiblingIndex).toBe(2);

		expect(grouped[2].type).toBe("parent");
		expect(grouped[2].startSiblingIndex).toBe(2);
		expect(grouped[2].nextStartSiblingIndex).toBe(3);

		expect(grouped[3].type).toBe("childless");
		expect(grouped[3].startSiblingIndex).toBe(3);
		expect(grouped[3].nextStartSiblingIndex).toBe(5);
	});

	it("split the children of an item where the last child has children", () => {
		const grouped = groupChildren(
			_item({
				children: [
					_item({}),
					_item({}),
					_item({
						isExpanded: true,
						children: [_item({})],
					}),
					_item({}),
					_item({
						isExpanded: true,
						children: [_item({})],
					}),
				],
			}),
		);
		expect(grouped.length).toBe(4);

		expect(grouped[0].type).toBe("childless");
		expect(grouped[0].startSiblingIndex).toBe(0);
		expect(grouped[0].nextStartSiblingIndex).toBe(2);

		expect(grouped[1].type).toBe("parent");
		expect(grouped[1].startSiblingIndex).toBe(2);
		expect(grouped[1].nextStartSiblingIndex).toBe(3);

		expect(grouped[2].type).toBe("childless");
		expect(grouped[2].startSiblingIndex).toBe(3);
		expect(grouped[2].nextStartSiblingIndex).toBe(4);

		expect(grouped[3].type).toBe("parent");
		expect(grouped[3].startSiblingIndex).toBe(4);
		expect(grouped[3].nextStartSiblingIndex).toBe(5);
	});

	it("split the children of an item where there are two subsequent parent children", () => {
		const grouped = groupChildren(
			_item({
				children: [
					_item({}),
					_item({}),
					_item({
						isExpanded: true,
						children: [_item({})],
					}),
					_item({
						isExpanded: true,
						children: [_item({})],
					}),
					_item({}),
				],
			}),
		);
		expect(grouped.length).toBe(4);

		expect(grouped[0].type).toBe("childless");
		expect(grouped[0].startSiblingIndex).toBe(0);
		expect(grouped[0].nextStartSiblingIndex).toBe(2);

		expect(grouped[1].type).toBe("parent");
		expect(grouped[1].startSiblingIndex).toBe(2);
		expect(grouped[1].nextStartSiblingIndex).toBe(3);

		expect(grouped[2].type).toBe("parent");
		expect(grouped[2].startSiblingIndex).toBe(3);
		expect(grouped[2].nextStartSiblingIndex).toBe(4);

		expect(grouped[3].type).toBe("childless");
		expect(grouped[3].startSiblingIndex).toBe(4);
		expect(grouped[3].nextStartSiblingIndex).toBe(5);
	});

	it("treats items with children but isExpanded=false as childless", () => {
		// Create an item with 5 children where the middle one has children but is not expanded
		const parent = _item({
			children: [
				_item({}),
				_item({}),
				_item({
					children: [_item({})],
					isExpanded: false, // This one has children but is collapsed
				}),
				_item({}),
				_item({
					children: [_item({})],
					isExpanded: true, // This one has children and is expanded
				}),
			],
		});

		const grouped = groupChildren(parent);
		expect(grouped.length).toBe(2);

		// First group: childless items at index 0-2
		expect(grouped[0].type).toBe("childless");
		expect(grouped[0].startSiblingIndex).toBe(0);
		expect(grouped[0].nextStartSiblingIndex).toBe(4);

		// Third group: parent item at index 4
		expect(grouped[1].type).toBe("parent");
		expect(grouped[1].startSiblingIndex).toBe(4);
		expect(grouped[1].nextStartSiblingIndex).toBe(5);
	});

	it("treats all items as childless when none have isExpanded=true", () => {
		// Create an item with 3 children where all have children but none are expanded
		const parent = _item({
			children: [
				_item({
					children: [_item({})],
					isExpanded: false,
				}),
				_item({
					children: [_item({})],
					isExpanded: false,
				}),
				_item({
					children: [_item({})],
					isExpanded: false,
				}),
			],
		});

		const grouped = groupChildren(parent);
		expect(grouped.length).toBe(1);

		// Single group: all items are childless
		expect(grouped[0].type).toBe("childless");
		expect(grouped[0].startSiblingIndex).toBe(0);
		expect(grouped[0].nextStartSiblingIndex).toBe(3);
	});
});
