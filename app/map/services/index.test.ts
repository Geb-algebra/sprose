import { describe, expect, it } from "vitest";
import type { Item } from "~/map/models";
import {
	parseMarkdownToItems,
	serializeItemsToMarkdown,
	updateItemDescription,
} from "./index";

describe("parseMarkdownToItems", () => {
	it("should parse a simple markdown list into items", () => {
		const markdown = `
      - Item 1
        - Item 2
          - Item 5
          - Item 6
        - Item 3
        - Item 4
          - Item 7
    `;

		const expected: Item[] = [
			{
				id: expect.any(String),
				description: "Item 1",
				children: [
					{
						id: expect.any(String),
						description: "Item 2",
						children: [
							{ id: expect.any(String), description: "Item 5", children: [] },
							{ id: expect.any(String), description: "Item 6", children: [] },
						],
					},
					{ id: expect.any(String), description: "Item 3", children: [] },
					{
						id: expect.any(String),
						description: "Item 4",
						children: [
							{ id: expect.any(String), description: "Item 7", children: [] },
						],
					},
				],
			},
		];

		const result = parseMarkdownToItems(markdown);
		expect(result).toEqual(expected);
	});

	it("should handle an empty markdown string", () => {
		const markdown = "";
		const result = parseMarkdownToItems(markdown);
		expect(result).toEqual([]);
	});

	it("should handle a markdown that has multiple root items", () => {
		const markdown = `
      - Item 1
        - Item 2
      - Item 3
        - Item 4
        - Item 5
    `;
		const expected: Item[] = [
			{
				id: expect.any(String),
				description: "Item 1",
				children: [
					{ id: expect.any(String), description: "Item 2", children: [] },
				],
			},
			{
				id: expect.any(String),
				description: "Item 3",
				children: [
					{ id: expect.any(String), description: "Item 4", children: [] },
					{ id: expect.any(String), description: "Item 5", children: [] },
				],
			},
		];
		const result = parseMarkdownToItems(markdown);
		expect(result).toEqual(expected);
	});
});

describe("serializeItemsToMarkdown", () => {
	it("should serialize items into a markdown string", () => {
		const items: Item[] = [
			{
				id: "1",
				description: "Item 1",
				children: [
					{
						id: "2",
						description: "Item 2",
						children: [
							{ id: "5", description: "Item 5", children: [] },
							{ id: "6", description: "Item 6", children: [] },
						],
					},
					{ id: "3", description: "Item 3", children: [] },
					{
						id: "4",
						description: "Item 4",
						children: [{ id: "7", description: "Item 7", children: [] }],
					},
				],
			},
		];

		const expected = `- Item 1
  - Item 2
    - Item 5
    - Item 6
  - Item 3
  - Item 4
    - Item 7`;

		const result = serializeItemsToMarkdown(items);
		expect(result).toEqual(expected);
	});

	it("should handle an empty list of items", () => {
		const items: Item[] = [];
		const result = serializeItemsToMarkdown(items);
		expect(result).toEqual("");
	});
});

describe("updateItemDescription", () => {
	it("should update the description of a root item", () => {
		const items: Item[] = [
			{
				id: "1",
				description: "Item 1",
				children: [
					{
						id: "2",
						description: "Item 2",
						children: [
							{ id: "5", description: "Item 5", children: [] },
							{ id: "6", description: "Item 6", children: [] },
						],
					},
					{ id: "3", description: "Item 3", children: [] },
					{
						id: "4",
						description: "Item 4",
						children: [{ id: "7", description: "Item 7", children: [] }],
					},
				],
			},
		];

		const updatedItems = updateItemDescription("1", "Updated Item 1", items);
		expect(updatedItems).toEqual([
			{
				id: "1",
				description: "Updated Item 1",
				children: [
					{
						id: "2",
						description: "Item 2",
						children: [
							{ id: "5", description: "Item 5", children: [] },
							{ id: "6", description: "Item 6", children: [] },
						],
					},
					{ id: "3", description: "Item 3", children: [] },
					{
						id: "4",
						description: "Item 4",
						children: [{ id: "7", description: "Item 7", children: [] }],
					},
				],
			},
		]);
	});

	it("should update the description of an item that is a child of a child", () => {
		const items: Item[] = [
			{
				id: "1",
				description: "Item 1",
				children: [
					{
						id: "2",
						description: "Item 2",
						children: [
							{ id: "5", description: "Item 5", children: [] },
							{
								id: "6",
								description: "Item 6",
								children: [{ id: "8", description: "Item 8", children: [] }],
							},
						],
					},
					{ id: "3", description: "Item 3", children: [] },
					{
						id: "4",
						description: "Item 4",
						children: [{ id: "7", description: "Item 7", children: [] }],
					},
				],
			},
		];

		const updatedItems = updateItemDescription("8", "Updated Item 8", items);
		expect(updatedItems).toEqual([
			{
				id: "1",
				description: "Item 1",
				children: [
					{
						id: "2",
						description: "Item 2",
						children: [
							{ id: "5", description: "Item 5", children: [] },
							{
								id: "6",
								description: "Item 6",
								children: [
									{ id: "8", description: "Updated Item 8", children: [] },
								],
							},
						],
					},
					{ id: "3", description: "Item 3", children: [] },
					{
						id: "4",
						description: "Item 4",
						children: [{ id: "7", description: "Item 7", children: [] }],
					},
				],
			},
		]);
	});
});
