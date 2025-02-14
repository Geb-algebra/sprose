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
	static KEY = "map";
	static async get() {
		const item = await localforage.getItem<Item>(MapRepository.KEY);
		if (!item) {
			return createEmptyMap();
		}
		return item;
	}

	static async save(map: Item) {
		return await localforage.setItem(MapRepository.KEY, map);
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

export class ExpandStatusRepository {
	static KEY = "expand-status";

	static async get() {
		return await localforage.getItem<string[]>(ExpandStatusRepository.KEY);
	}

	static async isExpanded(itemId: string) {
		const expandedItems = await ExpandStatusRepository.get();
		return expandedItems?.includes(itemId) || false;
	}

	static async toggle(itemId: string) {
		const expandedItems = (await ExpandStatusRepository.get()) || [];
		const newExpandedItems = expandedItems.includes(itemId)
			? expandedItems.filter((id) => id !== itemId)
			: [...expandedItems, itemId];
		return await localforage.setItem(
			ExpandStatusRepository.KEY,
			newExpandedItems,
		);
	}

	static async clear() {
		return await localforage.setItem(ExpandStatusRepository.KEY, []);
	}
}
