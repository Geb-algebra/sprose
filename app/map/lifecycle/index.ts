import localforage from "localforage";
import type { Item, MapData } from "../models";

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
		const mapData = await localforage.getItem<MapData>(MapRepository.KEY);
		if (!mapData) {
			return createEmptyMap();
		}
		return mapData.mapHistory[mapData.currentMapIndex];
	}

	static async save(map: Item) {
		const mapData = await localforage.getItem<MapData>(MapRepository.KEY);
		if (!mapData) {
			return await localforage.setItem(MapRepository.KEY, {
				mapHistory: [map],
				currentMapIndex: 0,
			});
		}
		// history is ordered from newest to oldest
		mapData.mapHistory = [
			map,
			...mapData.mapHistory.slice(mapData.currentMapIndex, mapData.mapHistory.length),
		];
		if (mapData.mapHistory.length > 100) {
			mapData.mapHistory.pop();
		}
		mapData.currentMapIndex = 0;

		return await localforage.setItem(MapRepository.KEY, mapData);
	}

	static async undo() {
		const mapData = await localforage.getItem<MapData>(MapRepository.KEY);
		if (!mapData) {
			return;
		}
		if (mapData.currentMapIndex === mapData.mapHistory.length - 1) {
			return;
		}
		mapData.currentMapIndex++;
		await localforage.setItem(MapRepository.KEY, mapData);
		return;
	}

	static async redo() {
		const mapData = await localforage.getItem<MapData>(MapRepository.KEY);
		if (!mapData) {
			return;
		}
		if (mapData.currentMapIndex === 0) {
			return;
		}
		mapData.currentMapIndex--;
		await localforage.setItem(MapRepository.KEY, mapData);
		return;
	}

	static async delete() {
		return await localforage.removeItem(MapRepository.KEY);
	}
}

export function generateId(): string {
	return Math.random().toString(36).substr(2, 9);
}

export function createNewItem(description: string, id?: string): Item {
	return {
		id: id ?? generateId(),
		description,
		isExpanded: false,
		children: [],
	};
}
