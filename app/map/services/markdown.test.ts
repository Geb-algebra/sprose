import { describe, expect, it } from "vitest";
import type { Item } from "../models";
import { parseMarkdownToItem, serializeItemToMarkdown } from "./markdown";
import { _expectedItem, _item, _rootItem } from "./test-utils";

describe("parseMarkdownToMap", () => {
	it("should parse a simple markdown list into items", () => {
		const markdown = `- Item 1
  - Item 2
    - Item 5
    - Item 6
  - Item 3
- Item 8
    `;
		const result = parseMarkdownToItem(markdown);
		expect(result).toEqual(
			_rootItem([
				_expectedItem({
					description: "Item 1",
					children: [
						_expectedItem({
							description: "Item 2",
							children: [
								_expectedItem({ description: "Item 5" }),
								_expectedItem({ description: "Item 6" }),
							],
						}),
						_expectedItem({ description: "Item 3" }),
					],
				}),
				_expectedItem({ description: "Item 8" }),
			]),
		);
	});

	it("should skip non-list items in markdown", () => {
		const markdown = `Some text
- Item 1
  - Item 2
More text
- Item 3`;
		const result = parseMarkdownToItem(markdown);
		expect(result).toEqual(
			_rootItem([
				_expectedItem({
					description: "Item 1",
					children: [_expectedItem({ description: "Item 2" })],
				}),
				_expectedItem({ description: "Item 3" }),
			]),
		);
	});

	it("should throw if there is no list item", () => {
		const markdown = "hoge";
		expect(() => parseMarkdownToItem(markdown)).toThrowError("No list items found in markdown");
	});
});

describe("serializeMapToMarkdown", () => {
	it("should serialize items into a markdown string", () => {
		const result = serializeItemToMarkdown(
			_rootItem([
				_item({
					description: "Item 1",
					children: [_item({ description: "Item 3" }), _item({ description: "Item 4" })],
				}),
				_item({ description: "Item 2" }),
			]),
		);

		expect(result).toEqual(`- Item 1
    - Item 3
    - Item 4
- Item 2`);
	});

	it("should handle an empty list of items", () => {
		const map: Item = {
			id: "__root",
			description: "",
			isExpanded: false,
			children: [],
		};
		const result = serializeItemToMarkdown(map);
		expect(result).toEqual("");
	});
});
