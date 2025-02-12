import localforage from "localforage";
import type { Item } from "../models";
import { parseMarkdownToItems, serializeItemsToMarkdown } from "../services";

export class MapRepository {
	static KEY = "markdownText";
	static async get() {
		const markdownText = await localforage.getItem<string>(MapRepository.KEY);
		if (!markdownText) {
			return [];
		}
		return parseMarkdownToItems(markdownText);
	}

	static async save(map: Item[]) {
		const markdownText = serializeItemsToMarkdown(map);
		return await localforage.setItem(MapRepository.KEY, markdownText);
	}

	static async delete() {
		return await localforage.removeItem(MapRepository.KEY);
	}
}
