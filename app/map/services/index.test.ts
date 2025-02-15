import { describe, expect, it } from "vitest";
import type { Item } from "~/map/models";
import {
	addNewItem,
	deleteItem,
	findParentByChildId,
	moveItem,
	parseMarkdownToMap,
	serializeMapToMarkdown,
	updateItem,
} from "./index";

function getSampleMap(): Item {
	return {
		id: "__root",
		description: "",
		isExpanded: true,
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
			{
				id: "8",
				description: "Item 8",
				isExpanded: false,
				children: [],
			},
		],
	};
}

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
      - Item 8
    `;
		const expected: Item = {
			id: "__root",
			description: "",
			isExpanded: true,
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
				{
					id: expect.any(String),
					description: "Item 8",
					isExpanded: false,
					children: [],
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
			isExpanded: true,
			children: [],
		});
	});
});

describe("serializeMapToMarkdown", () => {
	it("should serialize items into a markdown string", () => {
		const map = getSampleMap();

		const expected = `- Item 1
  - Item 2
    - Item 5
    - Item 6
  - Item 3
  - Item 4
    - Item 7
- Item 8`;

		const result = serializeMapToMarkdown(map);
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
		const items = getSampleMap();

		const updatedItems = updateItem(items, {
			id: "1",
			description: "Updated Item 1",
		});
		expect(updatedItems).toEqual({
			id: "__root",
			description: "",
			isExpanded: true,
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
				{
					id: "8",
					description: "Item 8",
					isExpanded: false,
					children: [],
				},
			],
		});
	});

	it("should update the description of an item that is a child of a child", () => {
		const map: Item = getSampleMap();

		const updatedItems = updateItem(map, {
			id: "6",
			description: "Updated Item 6",
		});
		expect(updatedItems).toEqual({
			id: "__root",
			description: "",
			isExpanded: true,
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
									description: "Updated Item 6",
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
				{
					id: "8",
					description: "Item 8",
					isExpanded: false,
					children: [],
				},
			],
		});
	});
});

describe("addNewItem", () => {
	it("should add a new item to the root", () => {
		const map = getSampleMap();

		const newMap = addNewItem("__root", map, {
			id: "some",
			description: "Some",
			isExpanded: false,
			children: [],
		});
		expect(newMap).toEqual({
			id: "__root",
			description: "",
			isExpanded: true,
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
				{
					id: "8",
					description: "Item 8",
					isExpanded: false,
					children: [],
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
		const map = getSampleMap();

		const newMap = addNewItem("6", map, {
			id: "some",
			description: "Some",
			isExpanded: false,
			children: [],
		});
		expect(newMap).toEqual({
			id: "__root",
			description: "",
			isExpanded: true,
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
											id: "some",
											description: "Some",
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
				{
					id: "8",
					description: "Item 8",
					isExpanded: false,
					children: [],
				},
			],
		});
	});

	it("should add a new item to a child at a specific index", () => {
		const map = getSampleMap();
		const newMap = addNewItem(
			"2",
			map,
			{
				id: "some",
				description: "Some",
				isExpanded: false,
				children: [],
			},
			0,
		);

		expect(newMap).toEqual({
			id: "__root",
			description: "",
			isExpanded: true,
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
									id: "some",
									description: "Some",
									isExpanded: false,
									children: [],
								},
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
				{
					id: "8",
					description: "Item 8",
					isExpanded: false,
					children: [],
				},
			],
		});
	});
});

describe("moveItem", () => {
	it("should move a root item before another item", () => {
		const map = getSampleMap();

		const newMap = moveItem("8", "__root", 0, map);
		expect(newMap).toEqual({
			id: "__root",
			description: "",
			isExpanded: true,
			children: [
				{
					id: "8",
					description: "Item 8",
					isExpanded: false,
					children: [],
				},
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
		});
	});

	it("should move a child to upper-level place", () => {
		const map = getSampleMap();

		const newMap = moveItem("6", "1", 1, map);
		expect(newMap).toEqual({
			id: "__root",
			description: "",
			isExpanded: true,
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
						{
							id: "6",
							description: "Item 6",
							isExpanded: false,
							children: [],
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
				{
					id: "8",
					description: "Item 8",
					isExpanded: false,
					children: [],
				},
			],
		});
	});

	it("should move a child to lower-level place", () => {
		const map = getSampleMap();

		const newMap = moveItem("2", "4", 1, map);
		expect(newMap).toEqual({
			id: "__root",
			description: "",
			isExpanded: true,
			children: [
				{
					id: "1",
					description: "Item 1",
					isExpanded: false,
					children: [
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
				},
				{
					id: "8",
					description: "Item 8",
					isExpanded: false,
					children: [],
				},
			],
		});
	});

	it("should do nothing when move a child to the same place", () => {
		const map = getSampleMap();

		const newMap = moveItem("3", "1", 1, map);
		expect(newMap).toEqual(map);
	});
});

describe("deleteItem", () => {
	it("should delete a root item", () => {
		const map = getSampleMap();
		const newMap = deleteItem("1", map);
		expect(newMap).toEqual({
			id: "__root",
			description: "",
			isExpanded: true,
			children: [
				{
					id: "8",
					description: "Item 8",
					isExpanded: false,
					children: [],
				},
			],
		});
	});

	it("should delete a child", () => {
		const map: Item = getSampleMap();

		const newMap = deleteItem("6", map);
		expect(newMap).toEqual({
			id: "__root",
			description: "",
			isExpanded: true,
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
				{
					id: "8",
					description: "Item 8",
					isExpanded: false,
					children: [],
				},
			],
		});
	});
});

describe("findParentByChildId", () => {
	it("should find the parent of a child item", () => {
		const map = getSampleMap();
		const parent = findParentByChildId(map, "6");
		expect(parent?.id).toBe("2");
	});

	it("should return null if the child is not found", () => {
		const map = getSampleMap();
		const parent = findParentByChildId(map, "non-existing");
		expect(parent).toBe(null);
	});
});
