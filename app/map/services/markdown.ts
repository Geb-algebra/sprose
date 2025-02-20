import { createNewItem } from "../lifecycle";
import type { Item } from "../models";

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
	const serial = serializeChildToMarkdown(map, 0);
	return !(map.id === "__root")
		? serial
		: serial
				.split("\n")
				.slice(1)
				.map((line) => (line.startsWith("    ") ? line.slice(4) : line))
				.join("\n");
}
