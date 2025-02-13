import localforage from "localforage";
import type { Item } from "../models";
import { parseMarkdownToMap, serializeMapToMarkdown } from "../services";

export function createEmptyMap(): Item {
	return {
		id: "__root",
		description: "",
		children: [],
	};
}

export class MapRepository {
	static KEY = "markdownText";
	static async get() {
		const markdownText = await localforage.getItem<string>(MapRepository.KEY);
		if (!markdownText) {
			return createEmptyMap();
		}
		return parseMarkdownToMap(markdownText);
	}

	static async save(map: Item) {
		const markdownText = serializeMapToMarkdown(map);
		return await localforage.setItem(MapRepository.KEY, markdownText);
	}

	static async delete() {
		return await localforage.removeItem(MapRepository.KEY);
	}
}

function generateId(): string {
	return Math.random().toString(36).substr(2, 9);
}

export function createNewItem(description: string): Item {
	return { id: generateId(), description, children: [] };
}
