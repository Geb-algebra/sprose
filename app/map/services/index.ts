import type { Item } from "~/map/models";
import { createNewItem } from "../lifecycle";

export function parseMarkdownToMap(markdown: string): Item {
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

function serializeItemToMarkdown(item: Item, level: number): string {
	const indent = "  ".repeat(level);
	const children = item.children
		.map((child) => serializeItemToMarkdown(child, level + 1))
		.join("\n");
	return `${indent}- ${item.description}${children ? `\n${children}` : ""}`;
}

export function serializeMapToMarkdown(map: Item): string {
	return serializeItemToMarkdown(map, 0)
		.split("\n")
		.slice(1)
		.map((line) => (line.startsWith("  ") ? line.slice(2) : line))
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
 * if no ID is provided, the item is added as a root item.
 */
export function addNewItem(parentId: string, item: Item, newItem: Item): Item {
	if (parentId === item.id) {
		return { ...item, children: [...item.children, newItem] };
	}
	return {
		...item,
		children: item.children.map((child) =>
			addNewItem(parentId, child, newItem),
		),
	};
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

export async function findChildById(
	item: Item,
	id: string,
): Promise<Item | null> {
	if (item.id === id) {
		return item;
	}
	for (const child of item.children) {
		const found = await findChildById(child, id);
		if (found) {
			return found;
		}
	}
	return null;
}
