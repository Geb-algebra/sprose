import localforage from "localforage";
import type { Item } from "../models";

export function createEmptyMap(): Item {
	return {
		id: "__root",
		description: "",
		isExpanded: true,
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
	return { id: generateId(), description, isExpanded: false, children: [] };
}
