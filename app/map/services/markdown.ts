import { createNewItem } from "../lifecycle";
import type { Item } from "../models";

export function parseMarkdownToItem(markdown: string): Item {
	const lines = markdown.split("\n").filter((line) => line.trim() !== "");
	const rootItems: Item[] = [];
	const stack: { item: Item; level: number }[] = [];

	for (const line of lines) {
		// Skip lines that don't look like list items
		if (!line.trim().match(/^\s*-/)) continue;

		const level = line.match(/^\s*/)?.[0].length || 0;
		const description = line.replace(/^\s*-\s*/, "").trim();
		const newItem = createNewItem(description);

		// Pop stack until we find the parent
		while (stack.length > 0 && stack[stack.length - 1].level >= level) stack.pop();

		// Add to parent or root
		if (stack.length === 0) rootItems.push(newItem);
		else stack[stack.length - 1].item.children.push(newItem);

		stack.push({ item: newItem, level });
	}

	if (rootItems.length === 0) {
		throw new Error("No list items found in markdown");
	}

	return {
		id: "__root",
		description: "",
		isExpanded: true,
		children: rootItems,
	} as Item;
}

function serializeChildToMarkdown(item: Item, level = 0): string {
	const indent = "    ".repeat(level);
	const line = `${indent}- ${item.description}`;

	return item.children.length
		? `${line}\n${item.children.map((child) => serializeChildToMarkdown(child, level + 1)).join("\n")}`
		: line;
}

export function serializeItemToMarkdown(map: Item): string {
	if (map.id !== "__root") return serializeChildToMarkdown(map);

	// For root items, skip the root and reduce indentation by one level
	return map.children.map((child) => serializeChildToMarkdown(child)).join("\n");
}
