import type { Item } from "~/map/models";
import { createNewItem } from "../lifecycle";

export function parseMarkdownToItem(markdown: string): Item {
	const lines = markdown.split("\n").filter((line) => line.trim() !== "");
	const rootItems: Item[] = [];
	const stack: { item: Item; level: number }[] = [];

	for (const line of lines) {
		const level = line.match(/^\s*/)?.[0].length || 0;
		const description = line.replace(/^\s*-\s*/, "").trim();
		const newItem: Item = createNewItem(description);

		while (stack.length > 0 && stack[stack.length - 1].level >= level) {
			stack.pop();
		}

		if (stack.length === 0) {
			rootItems.push(newItem);
		} else {
			stack[stack.length - 1].item.children.push(newItem);
		}

		stack.push({ item: newItem, level });
	}

	return {
		id: "__root",
		description: "",
		isExpanded: true,
		children: rootItems,
	} as Item;
}

function serializeChildToMarkdown(item: Item, level: number): string {
	const indent = "    ".repeat(level);
	const currentLine = `${indent}- ${item.description}`;
	const childrenMarkdown = item.children
		.map((child) => serializeChildToMarkdown(child, level + 1))
		.join("\n");
	return childrenMarkdown ? `${currentLine}\n${childrenMarkdown}` : currentLine;
}

export function serializeItemToMarkdown(map: Item): string {
	const isRoot = map.id === "__root";
	const serial = serializeChildToMarkdown(map, 0);
	return !isRoot
		? serial
		: serial
				.split("\n")
				.slice(1)
				.map((line) => (line.startsWith("    ") ? line.slice(4) : line))
				.join("\n");
}

export function updateItem(
	items: Item,
	newItem: { id: string } & Partial<Item>,
): Item {
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
export function addNewItem(
	parentId: string,
	map: Item,
	newItem: Item,
	at = 10000000000000,
): Item {
	if (parentId === map.id) {
		return {
			...map,
			children: [
				...map.children.slice(0, at),
				newItem,
				...map.children.slice(at, 10000000000000),
			],
		};
	}
	return {
		...map,
		children: map.children.map((child) =>
			addNewItem(parentId, child, newItem, at),
		),
	};
}

export function moveItem(
	movedItemId: string,
	targetParentId: string,
	targetSiblingIndex: number,
	map: Item,
) {
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

export function isItem(item: Item): item is Item {
	if (typeof item.id !== "string" || !item.id.trim()) {
		return false;
	}
	if (typeof item.description !== "string") {
		return false;
	}
	if (typeof item.isExpanded !== "boolean") {
		return false;
	}
	if (!Array.isArray(item.children)) {
		return false;
	}
	return item.children.every(isItem);
}

export function findChildById(item: Item, id: string): Item | null {
	if (item.id === id) {
		return item;
	}
	for (const child of item.children) {
		const found = findChildById(child, id);
		if (found) {
			return found;
		}
	}
	return null;
}

export function findParentByChildId(item: Item, id: string): Item | null {
	for (const child of item.children) {
		if (child.id === id) {
			return item;
		}
		const found = findParentByChildId(child, id);
		if (found) {
			return found;
		}
	}
	return null;
}
