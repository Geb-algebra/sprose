import type { Item } from "~/map/models";
import { createNewItem } from "../lifecycle";

export function updateItem(items: Item, newItem: { id: string } & Partial<Item>): Item {
	if (items.id === newItem.id) {
		return { ...items, ...newItem };
	}
	return {
		...items,
		children: items.children.map((child) => updateItem(child, newItem)),
	};
}

/**
 * Adds a new item as a child of the item with the given ID.
 */
export function addNewItem(parentId: string, map: Item, newItem: Item, at = 10000000000000): Item {
	if (parentId === map.id) {
		return {
			...map,
			children: [...map.children.slice(0, at), newItem, ...map.children.slice(at)],
		};
	}
	return {
		...map,
		children: map.children.map((child) => addNewItem(parentId, child, newItem, at)),
	};
}

export function moveItem(
	movedItemId: string,
	targetParentId: string,
	targetSiblingIndex: number,
	map: Item,
): Item {
	const movedItem = findChildById(map, movedItemId);
	if (!movedItem) {
		return map;
	}
	const newMap = deleteItem(movedItemId, map);
	const targetParent = findChildById(newMap, targetParentId);
	if (!targetParent) {
		return map;
	}
	return addNewItem(targetParent.id, newMap, movedItem, targetSiblingIndex);
}

// delete item from an item tree
export function deleteItem(itemId: string, item: Item): Item {
	return {
		...item,
		children: item.children
			.filter((child) => child.id !== itemId)
			.map((child) => deleteItem(itemId, child)),
	};
}

/**
 * Generic tree traversal utility that performs depth-first search on an Item tree.
 *
 * This function traverses the tree and applies a predicate function to each node.
 * When the predicate returns a non-null value for a node, the traversal for that branch
 * stops and the result is returned (optionally processed by childProcessor).
 *
 * @template T The type of result returned by the predicate and the function
 * @param item The root item from which to start the traversal
 * @param predicate Function that evaluates each node and returns a result (T) if found, or null if not
 * @returns The first non-null result from the predicate, optionally transformed by childProcessor, or null if not found
 *
 * @example
 * // Find an item by ID
 * const item = findInTree(root, node => node.id === targetId ? node : null);
 */
function findInTree<T>(item: Item, predicate: (item: Item) => T | null): T | null {
	const result = predicate(item);
	if (result) return result;

	for (const child of item.children) {
		const childResult = findInTree(child, predicate);
		if (childResult) {
			return childResult;
		}
	}
	return null;
}

export function findChildById(item: Item, id: string): Item | null {
	return findInTree(item, (node) => (node.id === id ? node : null));
}

export function findParentByChildId(item: Item, id: string): Item | null {
	return findInTree(item, (node) => (node.children.some((child) => child.id === id) ? node : null));
}

export {
	parseMarkdownToItem,
	serializeItemToMarkdown,
} from "./markdown";
