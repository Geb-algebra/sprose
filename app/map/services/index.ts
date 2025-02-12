import type { Item } from "~/map/models";

/**
 * Parses a markdown string into a hierarchical tree of items.
 *
 * This function takes a markdown string where each non-empty line represents an item.
 * The level of each item is determined by the number of leading whitespace characters.
 * Items with greater indentation are considered children of the nearest less-indented item.
 *
 * For example, given the markdown:
 *
 *   - Item 1
 *     - Item 1.1
 *     - Item 1.2
 *   - Item 2
 *
 * The function will produce a tree where "Item 1" has two children ("Item 1.1" and "Item 1.2"),
 * and "Item 2" is a separate root item.
 *
 * @param markdown - A string containing markdown formatted list items, with each line starting with a dash.
 * @returns An array of root items, each possibly containing nested children.
 */
export function parseMarkdownToItems(markdown: string): Item[] {
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

	return rootItems;
}

function generateId(): string {
	return Math.random().toString(36).substr(2, 9);
}

export function serializeItemToMarkdown(item: Item, level: number): string {
	const indent = "  ".repeat(level);
	const children = item.children
		.map((child) => serializeItemToMarkdown(child, level + 1))
		.join("\n");
	return `${indent}- ${item.description}${children ? `\n${children}` : ""}`;
}

export function serializeItemsToMarkdown(items: Item[]): string {
	return items.map((item) => serializeItemToMarkdown(item, 0)).join("\n");
}
