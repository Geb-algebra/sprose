import { describe, expect, it } from "vitest";
import { createNewItem } from "~/map/lifecycle";
import { parseMarkdownToItem } from "~/map/services";
import { groupChildren } from "./group-children";

const item = parseMarkdownToItem(`
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
`);

describe("groupChildren", () => {
	it("split the children of an item with children with child", () => {
		const grouped = groupChildren(item);
		expect(grouped.length).toBe(5);

		expect(grouped[0].type).toBe("childless");
		expect(grouped[0].startSiblingIndex).toBe(0);
		expect(grouped[0].items.length).toBe(2);
		expect(grouped[0].items[0].description).toBe("Item 1");
		expect(grouped[0].items[1].description).toBe("Item 2");

		expect(grouped[1].type).toBe("parent");
		expect(grouped[1].startSiblingIndex).toBe(2);
		expect(grouped[1].items.length).toBe(1);
		expect(grouped[1].items[0].description).toBe("Item 3");

		expect(grouped[2].type).toBe("childless");
		expect(grouped[2].startSiblingIndex).toBe(3);
		expect(grouped[2].items.length).toBe(1);
		expect(grouped[2].items[0].description).toBe("Item 4");

		expect(grouped[3].type).toBe("parent");
		expect(grouped[3].startSiblingIndex).toBe(4);
		expect(grouped[3].items.length).toBe(1);
		expect(grouped[3].items[0].description).toBe("Item 5");

		expect(grouped[4].type).toBe("childless");
		expect(grouped[4].startSiblingIndex).toBe(5);
		expect(grouped[4].items.length).toBe(3);
		expect(grouped[4].items[0].description).toBe("Item 6");
		expect(grouped[4].items[1].description).toBe("Item 7");
		expect(grouped[4].items[2].description).toBe("Item 8");
	});

	it("should return empty array if item has no children", () => {
		const grouped = groupChildren(createNewItem(""));
		expect(grouped.length).toBe(0);
	});
});
