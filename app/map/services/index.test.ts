import { describe, expect, it } from "vitest";
import type { Item } from "~/map/models";
import { addNewItem, deleteItem, findParentByChildId, moveItem, updateItem } from "./index";
import { _expectedItem, _item, _rootItem } from "./test-utils";

describe("updateItemDescription", () => {
	it("should update the description of a root item", () => {
		const map = _rootItem([
			_item({
				id: "1",
				description: "Item 1",
				children: [_item({ description: "Item 3" })],
			}),
			_item({ description: "Item 2" }),
		]);

		const updatedItems = updateItem(map, {
			id: "1",
			description: "Updated Item 1",
		});
		expect(updatedItems).toEqual(
			_rootItem([
				_expectedItem({
					description: "Updated Item 1",
					children: [_expectedItem({ description: "Item 3" })],
				}),
				_expectedItem({ description: "Item 2" }),
			]),
		);
	});

	it("should update the description of a child", () => {
		const map = _rootItem([
			_item({
				description: "Item 1",
				children: [
					_item({
						description: "Item 2",
						children: [_item({ description: "Item 5" }), _item({ id: "6", description: "Item 6" })],
					}),
				],
			}),
		]);

		const updatedItems = updateItem(map, {
			id: "6",
			description: "Updated Item 6",
		});
		expect(updatedItems).toEqual(
			_rootItem([
				_expectedItem({
					description: "Item 1",
					children: [
						_expectedItem({
							description: "Item 2",
							children: [
								_expectedItem({ description: "Item 5" }),
								_expectedItem({ description: "Updated Item 6" }),
							],
						}),
					],
				}),
			]),
		);
	});
});

describe("addNewItem", () => {
	it("should add a new item to the root", () => {
		const map = _rootItem([
			_item({
				description: "Item 1",
				children: [_item({ description: "Item 2" })],
			}),
		]);

		const newMap = addNewItem("__root", map, {
			id: "some",
			description: "Some",
			isExpanded: false,
			children: [],
		});
		expect(newMap).toEqual(
			_rootItem([
				_expectedItem({
					description: "Item 1",
					children: [_expectedItem({ description: "Item 2" })],
				}),
				_expectedItem({ description: "Some" }),
			]),
		);
	});

	it("should add a new item to a child", () => {
		const map = _rootItem([_item({ id: "1", children: [_item({ id: "2" })] })]);

		const newMap = addNewItem("1", map, {
			id: "some",
			description: "Some",
			isExpanded: false,
			children: [],
		});
		expect(newMap).toEqual(
			_rootItem([
				_expectedItem({
					id: "1",
					children: [_expectedItem({ id: "2" }), _expectedItem({ id: "some" })],
				}),
			]),
		);
	});

	it("should add a new item to a child at a specific index", () => {
		const map = _rootItem([
			_item({
				id: "1",
				children: [_item({ id: "2" }), _item({ id: "3" }), _item({ id: "4" })],
			}),
		]);
		const newMap = addNewItem(
			"1",
			map,
			{
				id: "some",
				description: "Some",
				isExpanded: false,
				children: [],
			},
			2,
		);

		expect(newMap).toEqual(
			_rootItem([
				_expectedItem({
					id: "1",
					children: [
						_expectedItem({ id: "2" }),
						_expectedItem({ id: "3" }),
						_expectedItem({ id: "some", description: "Some" }),
						_expectedItem({ id: "4" }),
					],
				}),
			]),
		);
	});
});

describe("moveItem", () => {
	it("should move a root item before another item", () => {
		const map = _rootItem([_item({ id: "1" }), _item({ id: "2" }), _item({ id: "3" })]);

		const newMap = moveItem("2", "__root", 0, map);
		expect(newMap).toEqual(
			_rootItem([
				_expectedItem({ id: "2" }),
				_expectedItem({ id: "1" }),
				_expectedItem({ id: "3" }),
			]),
		);
	});

	it("should move a child to upper-level place", () => {
		const map = _rootItem([
			_item({
				id: "1",
				children: [
					_item({
						id: "2",
						children: [_item({ id: "5" })],
					}),
					_item({ id: "6" }),
					_item({ id: "3" }),
				],
			}),
		]);

		const newMap = moveItem("3", "1", 1, map);
		expect(newMap).toEqual(
			_rootItem([
				_expectedItem({
					id: "1",
					children: [
						_expectedItem({
							id: "2",
							children: [_expectedItem({ id: "5" })],
						}),
						_expectedItem({ id: "3" }),
						_expectedItem({ id: "6" }),
					],
				}),
			]),
		);
	});

	it("should move a child to lower-level place", () => {
		const map = _rootItem([
			_item({
				id: "1",
				children: [
					_item({
						id: "2",
						children: [_item({ id: "5" })],
					}),
					_item({ id: "6" }),
					_item({ id: "3" }),
				],
			}),
		]);

		const newMap = moveItem("6", "2", 1, map);
		expect(newMap).toEqual(
			_rootItem([
				_expectedItem({
					id: "1",
					children: [
						_expectedItem({
							id: "2",
							children: [_expectedItem({ id: "5" }), _expectedItem({ id: "6" })],
						}),
						_expectedItem({ id: "3" }),
					],
				}),
			]),
		);
	});

	it("should move a child to the same-level place", () => {
		const map = _rootItem([
			_item({
				id: "1",
				children: [
					_item({
						id: "2",
						children: [_item({ id: "5" })],
					}),
					_item({ id: "6" }),
					_item({ id: "3" }),
				],
			}),
		]);

		const newMap = moveItem("2", "1", 1, map);
		expect(newMap).toEqual(
			_rootItem([
				_expectedItem({
					id: "1",
					children: [
						_expectedItem({ id: "6" }),
						_expectedItem({
							id: "2",
							children: [_expectedItem({ id: "5" })],
						}),
						_expectedItem({ id: "3" }),
					],
				}),
			]),
		);
	});

	it("should do nothing when move a child to the same place", () => {
		const map = _rootItem([
			_item({
				id: "1",
				children: [
					_item({
						id: "2",
						children: [_item({ id: "5" })],
					}),
					_item({ id: "6" }),
					_item({ id: "3" }),
				],
			}),
		]);

		const newMap = moveItem("2", "1", 0, map);
		expect(newMap).toEqual(map);
	});
});

describe("deleteItem", () => {
	it("should delete a root item", () => {
		const map = _rootItem([_item({ id: "1" }), _item({ id: "2" }), _item({ id: "3" })]);
		const newMap = deleteItem("2", map);

		expect(newMap).toEqual(_rootItem([_expectedItem({ id: "1" }), _expectedItem({ id: "3" })]));
	});

	it("should delete a child", () => {
		const map = _rootItem([
			_item({
				id: "1",
				children: [_item({ id: "2" }), _item({ id: "3" }), _item({ id: "4" })],
			}),
		]);
		const newMap = deleteItem("3", map);

		expect(newMap).toEqual(
			_rootItem([
				_expectedItem({
					id: "1",
					children: [_expectedItem({ id: "2" }), _expectedItem({ id: "4" })],
				}),
			]),
		);
	});
});

describe("findParentByChildId", () => {
	it("should find the parent of a child item", () => {
		const map = _rootItem([
			_item({
				id: "1",
				children: [_item({ id: "2" }), _item({ id: "3" }), _item({ id: "4" })],
			}),
		]);

		const parent = findParentByChildId(map, "3");
		expect(parent).toEqual(map.children[0]);
	});

	it("should return null if the child is not found", () => {
		const map = _rootItem([
			_item({
				id: "1",
				children: [_item({ id: "2" }), _item({ id: "3" }), _item({ id: "4" })],
			}),
		]);

		const parent = findParentByChildId(map, "5");
		expect(parent).toBeNull();
	});
});
