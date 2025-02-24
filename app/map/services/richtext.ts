import { createNewItem } from "../lifecycle";
import type { Item } from "../models";

// Parses the provided HTML string and returns an Item tree containing concatenated items
// found in all top-level <ul> elements.
export async function parseHTMLListToItem(html: string): Promise<Item> {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");

	// Get top-level ULs from the document body.
	const uls = Array.from(doc.body.children).filter((child) => child.tagName.toLowerCase() === "ul");

	if (uls.length === 0) {
		throw new Error("No list found in HTML");
	}

	// Parse each UL and concatenate their items.
	const allItems = uls.reduce<Item[]>((acc, ul) => {
		const items = parseUL(ul);
		return acc.concat(items);
	}, []);

	return {
		id: "__root",
		description: "",
		isExpanded: true,
		children: allItems,
	} as Item;
}

function parseUL(ul: Element): Item[] {
	const liElements = Array.from(ul.children).filter(
		(child) => child.tagName.toLowerCase() === "li",
	);
	return liElements.map((li) => parseLI(li));
}

function parseLI(li: Element): Item {
	let description = "";
	let children: Item[] = [];

	for (const node of li.childNodes) {
		if (node.nodeType === Node.TEXT_NODE) {
			const text = node.textContent?.trim();
			if (text) {
				description += `${text} `;
			}
		} else if (node.nodeType === Node.ELEMENT_NODE) {
			const element = node as Element;
			if (element.tagName.toLowerCase() === "ul") {
				children = parseUL(element);
			} else {
				const text = element.textContent?.trim();
				if (text) {
					description += `${text} `;
				}
			}
		}
	}

	description = description.trim();
	const item = createNewItem(description);
	item.children = children;
	return item;
}

// Helper function to recursively serialize an Item to HTML with a given indent.
function serializeItem(item: Item, level: number): string {
	const indent = "  ".repeat(level);
	let html = `${indent}<li>${item.description}`;
	if (item.children && item.children.length > 0) {
		// When rendering nested list, increase indent by one for the <ul>
		const ulIndent = "  ".repeat(level + 1);
		// And increase indent by 2 for child <li> elements
		const childrenHTML = item.children.map((child) => serializeItem(child, level + 2)).join("\n");
		html += `\n${ulIndent}<ul>\n${childrenHTML}\n${ulIndent}</ul>\n${indent}`;
	}
	html += "</li>";
	return html;
}

export function serializeItemToHTML(root: Item): string {
	// We assume the provided root's children are the actual list items.
	const childrenHTML = root.children.map((child) => serializeItem(child, 1)).join("\n");
	return `<ul>\n${childrenHTML}\n</ul>`;
}
