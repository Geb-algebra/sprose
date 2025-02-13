import type { Item, Item } from "~/map/models";

export function parseMarkdownToMap(markdown: string): Item {
	const lines = markdown.split("\n").filter((line) => line.trim() !== "");
	const rootItems: Item[] = [];
	const stack: { item: Item; level: number }[] = [];

	for (const line of lines) {
		const level = line.match(/^\s*/)?.[0].length || 0;
		const description = line.replace(/^\s*-\s*/, "").trim();
		const newItem: Item = { id: generateId(), description, children: [] };

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
		children: rootItems,
	} as Item;
}

function generateId(): string {
	return Math.random().toString(36).substr(2, 9);
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

export function updateItemDescription(
	items: Item,
	itemId: string,
	newDescription: string,
): Item {
	if (items.id === itemId) {
		return { ...items, description: newDescription };
	}
	return {
		...items,
		children: items.children.map((child) =>
			updateItemDescription(child, itemId, newDescription),
		),
	};
}

/**
 * Adds a new item as a child of the item with the given ID.
 * if no ID is provided, the item is added as a root item.
 */
export function addNewItem(parentId: string, item: Item): Item {
	const newItem: Item = { id: generateId(), description: "", children: [] };
	if (parentId === item.id) {
		return { ...item, children: [...item.children, newItem] };
	}
	return {
		...item,
		children: item.children.map((child) => addNewItem(parentId, child)),
	};
}
