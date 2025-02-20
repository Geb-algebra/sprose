import type { Item } from "~/map/models";
import { parseMarkdownToItem, serializeItemToMarkdown } from "./index";

// filepath: /Users/watanabe/Documents/dev/sprose/app/map/services/clipboard.client.ts

export async function copyItemToClipboard(item: Item): Promise<void> {
	const markdown = serializeItemToMarkdown(item);
	await navigator.clipboard.writeText(markdown);
}

export async function getChildFromClipboard(): Promise<Item[] | null> {
	const markdown = await navigator.clipboard.readText();
	console.log(parseMarkdownToItem(markdown));
	return parseMarkdownToItem(markdown).children;
}
