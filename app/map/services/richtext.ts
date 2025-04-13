import { createNewItem } from "../lifecycle";
import type { Item } from "../models";

// Parses the provided HTML string and returns an Item tree
export async function parseHTMLListToItem(html: string): Promise<Item> {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");

	// Get top-level ULs from the document body
	const uls = Array.from(doc.body.children).filter((child) => child.tagName.toLowerCase() === "ul");

	if (uls.length === 0) throw new Error("No list found in HTML");

	// Parse each UL and concatenate their items
	const allItems = uls.reduce<Item[]>((acc, ul) => acc.concat(parseUL(ul)), []);

	return {
		id: "__root",
		description: "",
		isExpanded: true,
		children: allItems,
	} as Item;
}

function parseUL(ul: Element): Item[] {
	return Array.from(ul.children)
		.filter((child) => child.tagName.toLowerCase() === "li")
		.map((li) => parseLI(li));
}

function parseLI(li: Element): Item {
	let description = "";
	let children: Item[] = [];

	for (const node of li.childNodes) {
		if (node.nodeType === Node.TEXT_NODE) {
			const text = node.textContent?.trim();
			if (text) description += `${text} `;
		} else if (node.nodeType === Node.ELEMENT_NODE) {
			const element = node as Element;
			if (element.tagName.toLowerCase() === "ul") {
				children = parseUL(element);
			} else {
				const text = element.textContent?.trim();
				if (text) description += `${text} `;
			}
		}
	}

	const item = createNewItem(description.trim());
	item.children = children;
	return item;
}

// Serialize an Item to HTML without any whitespace or indentation
function serializeItem(item: Item): string {
	let html = `<li>${item.description}`;

	if (item.children.length > 0) {
		const childrenHTML = item.children.map((child) => serializeItem(child)).join("");
		html += `<ul>${childrenHTML}</ul>`;
	}

	return `${html}</li>`;
}

export function serializeItemToHTML(root: Item): string {
	const childrenHTML = root.children.map((child) => serializeItem(child)).join("");
	return `<ul>${childrenHTML}</ul>`;
}
