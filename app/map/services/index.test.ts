import { describe, expect, it } from "vitest";
import type { Item } from "~/map/models";
import {
	addNewItem,
	deleteItem,
	parseMarkdownToMap,
	serializeMapToMarkdown,
	updateItem,
} from "./index";

describe("parseMarkdownToMap", () => {
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

		const expected: Item = {
			id: "__root",
			description: "",
			isExpanded: false,
			children: [
				{
					id: expect.any(String),
					description: "Item 1",
					isExpanded: false,
					children: [
						{
							id: expect.any(String),
							description: "Item 2",
							isExpanded: false,
							children: [
								{
									id: expect.any(String),
									description: "Item 5",
									isExpanded: false,
									children: [],
								},
								{
									id: expect.any(String),
									description: "Item 6",
									isExpanded: false,
									children: [],
								},
							],
						},
						{
							id: expect.any(String),
							description: "Item 3",
							isExpanded: false,
							children: [],
						},
						{
							id: expect.any(String),
							description: "Item 4",
							isExpanded: false,
							children: [
								{
									id: expect.any(String),
									description: "Item 7",
									isExpanded: false,
									children: [],
								},
							],
						},
					],
				},
			],
		};

		const result = parseMarkdownToMap(markdown);
		expect(result).toEqual(expected);
	});

	it("should handle an empty markdown string", () => {
		const markdown = "";
		const result = parseMarkdownToMap(markdown);
		expect(result).toEqual({
			id: "__root",
			description: "",
			isExpanded: false,
			children: [],
		});
	});

	it("should handle a markdown that has multiple root items", () => {
		const markdown = `
      - Item 1
        - Item 2
      - Item 3
        - Item 4
        - Item 5
    `;
		const expected: Item = {
			id: "__root",
			description: "",
			isExpanded: false,
			children: [
				{
					id: expect.any(String),
					description: "Item 1",
					isExpanded: false,
					children: [
						{
							id: expect.any(String),
							description: "Item 2",
							isExpanded: false,
							children: [],
						},
					],
				},
				{
					id: expect.any(String),
					description: "Item 3",
					isExpanded: false,
					children: [
						{
							id: expect.any(String),
							description: "Item 4",
							isExpanded: false,
							children: [],
						},
						{
							id: expect.any(String),
							description: "Item 5",
							isExpanded: false,
							children: [],
						},
					],
				},
			],
		};
		const result = parseMarkdownToMap(markdown);
		expect(result).toEqual(expected);
	});
});

describe("serializeMapToMarkdown", () => {
	it("should serialize items into a markdown string", () => {
		const items: Item = {
			id: "__root",
			description: "",
			isExpanded: false,
			children: [
				{
					id: "1",
					description: "Item 1",
					isExpanded: false,
					children: [
						{
							id: "2",
							description: "Item 2",
							isExpanded: false,
							children: [
								{
									id: "5",
									description: "Item 5",
									isExpanded: false,
									children: [],
								},
								{
									id: "6",
									description: "Item 6",
									isExpanded: false,
									children: [],
								},
							],
						},
						{ id: "3", description: "Item 3", isExpanded: false, children: [] },
						{
							id: "4",
							description: "Item 4",
							isExpanded: false,
							children: [
								{
									id: "7",
									description: "Item 7",
									isExpanded: false,
									children: [],
								},
							],
						},
					],
				},
			],
		};

		const expected = `- Item 1
  - Item 2
    - Item 5
    - Item 6
  - Item 3
  - Item 4
    - Item 7`;

		const result = serializeMapToMarkdown(items);
		expect(result).toEqual(expected);
	});

	it("should handle an empty list of items", () => {
		const map: Item = {
			id: "__root",
			description: "",
			isExpanded: false,
			children: [],
		};
		const result = serializeMapToMarkdown(map);
		expect(result).toEqual("");
	});
});

describe("updateItemDescription", () => {
	it("should update the description of a root item", () => {
		const items: Item = {
			id: "__root",
			description: "",
			isExpanded: false,
			children: [
				{
					id: "1",
					description: "Item 1",
					isExpanded: false,
					children: [
						{
							id: "2",
							description: "Item 2",
							isExpanded: false,
							children: [
								{
									id: "5",
									description: "Item 5",
									isExpanded: false,
									children: [],
								},
								{
									id: "6",
									description: "Item 6",
									isExpanded: false,
									children: [],
								},
							],
						},
						{ id: "3", description: "Item 3", isExpanded: false, children: [] },
						{
							id: "4",
							description: "Item 4",
							isExpanded: false,
							children: [
								{
									id: "7",
									description: "Item 7",
									isExpanded: false,
									children: [],
								},
							],
						},
					],
				},
			],
		};

		const updatedItems = updateItem(items, {
			id: "1",
			description: "Updated Item 1",
		});
		expect(updatedItems).toEqual({
			id: "__root",
			description: "",
			isExpanded: false,
			children: [
				{
					id: "1",
					description: "Updated Item 1",
					isExpanded: false,
					children: [
						{
							id: "2",
							description: "Item 2",
							isExpanded: false,
							children: [
								{
									id: "5",
									description: "Item 5",
									isExpanded: false,
									children: [],
								},
								{
									id: "6",
									description: "Item 6",
									isExpanded: false,
									children: [],
								},
							],
						},
						{ id: "3", description: "Item 3", isExpanded: false, children: [] },
						{
							id: "4",
							description: "Item 4",
							isExpanded: false,
							children: [
								{
									id: "7",
									description: "Item 7",
									isExpanded: false,
									children: [],
								},
							],
						},
					],
				},
			],
		});
	});

	it("should update the description of an item that is a child of a child", () => {
		const map: Item = {
			id: "__root",
			description: "",
			isExpanded: false,
			children: [
				{
					id: "1",
					description: "Item 1",
					isExpanded: false,
					children: [
						{
							id: "2",
							description: "Item 2",
							isExpanded: false,
							children: [
								{
									id: "5",
									description: "Item 5",
									isExpanded: false,
									children: [],
								},
								{
									id: "6",
									description: "Item 6",
									isExpanded: false,
									children: [
										{
											id: "8",
											description: "Item 8",
											isExpanded: false,
											children: [],
										},
									],
								},
							],
						},
						{ id: "3", description: "Item 3", isExpanded: false, children: [] },
						{
							id: "4",
							description: "Item 4",
							isExpanded: false,
							children: [
								{
									id: "7",
									description: "Item 7",
									isExpanded: false,
									children: [],
								},
							],
						},
					],
				},
			],
		};

		const updatedItems = updateItem(map, {
			id: "8",
			description: "Updated Item 8",
		});
		expect(updatedItems).toEqual({
			id: "__root",
			description: "",
			isExpanded: false,
			children: [
				{
					id: "1",
					description: "Item 1",
					isExpanded: false,
					children: [
						{
							id: "2",
							description: "Item 2",
							isExpanded: false,
							children: [
								{
									id: "5",
									description: "Item 5",
									isExpanded: false,
									children: [],
								},
								{
									id: "6",
									description: "Item 6",
									isExpanded: false,
									children: [
										{
											id: "8",
											description: "Updated Item 8",
											isExpanded: false,
											children: [],
										},
									],
								},
							],
						},
						{ id: "3", description: "Item 3", isExpanded: false, children: [] },
						{
							id: "4",
							description: "Item 4",
							isExpanded: false,
							children: [
								{
									id: "7",
									description: "Item 7",
									isExpanded: false,
									children: [],
								},
							],
						},
					],
				},
			],
		});
	});
});

describe("addNewItem", () => {
	it("should add a new item to the root", () => {
		const map: Item = {
			id: "__root",
			description: "",
			isExpanded: false,
			children: [
				{
					id: "1",
					description: "Item 1",
					isExpanded: false,
					children: [
						{
							id: "2",
							description: "Item 2",
							isExpanded: false,
							children: [
								{
									id: "5",
									description: "Item 5",
									isExpanded: false,
									children: [],
								},
								{
									id: "6",
									description: "Item 6",
									isExpanded: false,
									children: [],
								},
							],
						},
					],
				},
			],
		};

		const newMap = addNewItem("__root", map, {
			id: "some",
			description: "Some",
			isExpanded: false,
			children: [],
		});
		expect(newMap).toEqual({
			id: "__root",
			description: "",
			isExpanded: false,
			children: [
				{
					id: "1",
					description: "Item 1",
					isExpanded: false,
					children: [
						{
							id: "2",
							description: "Item 2",
							isExpanded: false,
							children: [
								{
									id: "5",
									description: "Item 5",
									isExpanded: false,
									children: [],
								},
								{
									id: "6",
									description: "Item 6",
									isExpanded: false,
									children: [],
								},
							],
						},
					],
				},
				{
					id: expect.any(String),
					description: "Some",
					isExpanded: false,
					children: [],
				},
			],
		});
	});

	it("should add a new item to a child", () => {
		const map: Item = {
			id: "__root",
			description: "",
			isExpanded: false,
			children: [
				{
					id: "1",
					description: "Item 1",
					isExpanded: false,
					children: [
						{
							id: "2",
							description: "Item 2",
							isExpanded: false,
							children: [
								{
									id: "5",
									description: "Item 5",
									isExpanded: false,
									children: [],
								},
								{
									id: "6",
									description: "Item 6",
									isExpanded: false,
									children: [],
								},
							],
						},
					],
				},
			],
		};

		const newMap = addNewItem("6", map, {
			id: "some",
			description: "Some",
			isExpanded: false,
			children: [],
		});
		expect(newMap).toEqual({
			id: "__root",
			description: "",
			isExpanded: false,
			children: [
				{
					id: "1",
					description: "Item 1",
					isExpanded: false,
					children: [
						{
							id: "2",
							description: "Item 2",
							isExpanded: false,
							children: [
								{
									id: "5",
									description: "Item 5",
									isExpanded: false,
									children: [],
								},
								{
									id: "6",
									description: "Item 6",
									isExpanded: false,
									children: [
										{
											id: expect.any(String),
											description: "Some",
											isExpanded: false,
											children: [],
										},
									],
								},
							],
						},
					],
				},
			],
		});
	});
});

describe("addNewItem", () => {
	it("should delete a root item", () => {
		const map: Item = {
			id: "__root",
			description: "",
			isExpanded: false,
			children: [
				{
					id: "1",
					description: "Item 1",
					isExpanded: false,
					children: [
						{
							id: "2",
							description: "Item 2",
							isExpanded: false,
							children: [
								{
									id: "5",
									description: "Item 5",
									isExpanded: false,
									children: [],
								},
								{
									id: "6",
									description: "Item 6",
									isExpanded: false,
									children: [],
								},
							],
						},
					],
				},
			],
		};

		const newMap = deleteItem("1", map);
		expect(newMap).toEqual({
			id: "__root",
			description: "",
			isExpanded: false,
			children: [],
		});
	});

	it("should delete a child", () => {
		const map: Item = {
			id: "__root",
			description: "",
			isExpanded: false,
			children: [
				{
					id: "1",
					description: "Item 1",
					isExpanded: false,
					children: [
						{
							id: "2",
							description: "Item 2",
							isExpanded: false,
							children: [
								{
									id: "5",
									description: "Item 5",
									isExpanded: false,
									children: [],
								},
								{
									id: "6",
									description: "Item 6",
									isExpanded: false,
									children: [],
								},
							],
						},
					],
				},
			],
		};

		const newMap = deleteItem("6", map);
		expect(newMap).toEqual({
			id: "__root",
			description: "",
			isExpanded: false,
			children: [
				{
					id: "1",
					description: "Item 1",
					isExpanded: false,
					children: [
						{
							id: "2",
							description: "Item 2",
							isExpanded: false,
							children: [
								{
									id: "5",
									description: "Item 5",
									isExpanded: false,
									children: [],
								},
							],
						},
					],
				},
			],
		});
	});
});
