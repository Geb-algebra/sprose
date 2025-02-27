import type { Item } from "~/map/models";
import { parseMarkdownToItem, serializeItemToMarkdown } from "./index";
import { parseHTMLListToItem, serializeItemToHTML } from "./richtext";

export async function copyMarkdownToClipboard(item: Item) {
	const markdown = serializeItemToMarkdown(item);
	await navigator.clipboard.writeText(markdown);
}

export async function copyHTMLToClipboard(item: Item) {
	const html = serializeItemToHTML(item);
	await navigator.clipboard.write([
		new ClipboardItem({ "text/html": new Blob([html], { type: "text/html" }) }),
	]);
}

export async function copyItemToClipboard(
	item: Item,
	as: "markdown" | "html" = "markdown",
): Promise<void> {
	as === "markdown" ? await copyMarkdownToClipboard(item) : await copyHTMLToClipboard(item);
}

async function getChildFromClipboardAsMarkdown(): Promise<Item[] | null> {
	return navigator.clipboard.readText().then((markdown) => parseMarkdownToItem(markdown).children);
}

async function getChildFromClipboardAsHTML(): Promise<Item[] | null> {
	return navigator.clipboard.read().then(async (items) => {
		const html = await items[0].getType("text/html");
		const htmlString = await html.text();
		const item = await parseHTMLListToItem(htmlString);
		return item.children;
	});
}

export async function getChildFromClipboard(): Promise<Item[] | null> {
	try {
		return await getChildFromClipboardAsMarkdown();
	} catch (e) {
		try {
			return await getChildFromClipboardAsHTML();
		} catch (e) {
			throw new Error("Clipboard does not contain a valid item");
		}
	}
}
