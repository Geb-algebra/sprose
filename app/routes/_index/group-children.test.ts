import { describe, expect, it } from "vitest";
import { createNewItem } from "~/map/lifecycle";
import { parseMarkdownToItem } from "~/map/services";
import { groupChildren } from "./group-children";

describe("groupChildren", () => {
	it("split the children of an item with children with child", () => {
		const grouped = groupChildren(
			parseMarkdownToItem(`
- Item 1
- Item 2
- Item 3
  - Item 3.1
- Item 4
- Item 5
  - Item 5.1
- Item 6
- Item 7
- Item 8
`),
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
			parseMarkdownToItem(`
- Item 1
- Item 2
- Item 3
  - Item 3.1
- Item 4
- Item 5
  - Item 5.1
`),
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
			parseMarkdownToItem(`
- Item 1
- Item 2
- Item 3
  - Item 3.1
- Item 4
  - Item 4.1
- Item 5
`),
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
});
