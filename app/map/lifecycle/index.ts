import localforage from "localforage";
import type { Item, MapData } from "../models";

export function createEmptyMap(): Item {
	return {
		id: "__root",
		description: "",
		isExpanded: true,
		children: [createNewItem("")],
	};
}

export class MapRepository {
	static KEY = "map";

	static async get() {
		const mapData = await localforage.getItem<MapData>(MapRepository.KEY);
		return mapData ? mapData.mapHistory[mapData.currentMapIndex] : createEmptyMap();
	}

	static async save(map: Item) {
		const mapData = (await localforage.getItem<MapData>(MapRepository.KEY)) || {
			mapHistory: [],
			currentMapIndex: 0,
		};

		// Add new map to history (newest first)
		mapData.mapHistory = [map, ...mapData.mapHistory.slice(mapData.currentMapIndex)];

		// Trim history if too long
		if (mapData.mapHistory.length > 100) mapData.mapHistory.length = 100;

		mapData.currentMapIndex = 0;
		return await localforage.setItem(MapRepository.KEY, mapData);
	}

	static async undo() {
		const mapData = await localforage.getItem<MapData>(MapRepository.KEY);
		if (!mapData || mapData.currentMapIndex >= mapData.mapHistory.length - 1) return;

		mapData.currentMapIndex++;
		await localforage.setItem(MapRepository.KEY, mapData);
	}

	static async redo() {
		const mapData = await localforage.getItem<MapData>(MapRepository.KEY);
		if (!mapData || mapData.currentMapIndex === 0) return;

		mapData.currentMapIndex--;
		await localforage.setItem(MapRepository.KEY, mapData);
	}

	static async delete() {
		return await localforage.removeItem(MapRepository.KEY);
	}
}

export const generateId = () => Math.random().toString(36).substr(2, 9);

export function createNewItem(description: string, id?: string): Item {
	return {
		id: id ?? generateId(),
		description,
		isExpanded: true,
		children: [],
	};
}
