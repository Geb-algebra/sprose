import { createContext, useContext, useState } from "react";
import { createNewItem } from "~/map/lifecycle";
import type { Item } from "~/map/models";
import {
	addNewItem,
	deleteItem,
	findChildById,
	findParentByChildId,
	moveItem,
	updateItem,
} from "~/map/services";

export const mapControllerContext = createContext<{
	updateItemText: (item: Item, content: string) => void;
	updateChildren: (item: Item, children: Item[]) => void;
	toggleExpand: (item: Item) => void;
	removeItem: (item: Item) => void;
	moveOrAddItem: (movedItemId: string, targetParentId: string, targetSiblingIndex: number) => void;
	addingItemId: string | null;
	setAddingItemId: (addingItemId: string | null) => void;
}>({
	updateItemText: () => {},
	updateChildren: () => {},
	toggleExpand: () => {},
	removeItem: () => {},
	moveOrAddItem: () => {},
	addingItemId: null,
	setAddingItemId: () => {},
});

export const MapControllerProvider = ({
	children,
	submitMap,
	map,
}: { children: React.ReactNode; submitMap: (map: Item) => void; map: Item }) => {
	const [addingItemId, setAddingItemId] = useState<string | null>(null);

	function removeItem(item: Item) {
		submitMap(deleteItem(item.id, map));
		setAddingItemId(null);
	}

	function updateItemText(item: Item, content: string) {
		const parent = findParentByChildId(map, item.id);
		if (!parent) {
			throw new Error("Parent not found");
		}
		const siblingIndex = parent.children.indexOf(item);
		if (siblingIndex === -1) {
			throw new Error("Sibling index not found");
		}

		if (content.trim() === "") {
			removeItem(item);
		} else {
			item.description = content;
			const newMap = updateItem(map, item);
			const newItem = createNewItem("");
			setAddingItemId(newItem.id);
			submitMap(addNewItem(parent.id, newMap, newItem, siblingIndex + 1));
		}
	}

	function updateChildren(item: Item, children: Item[]) {
		submitMap(updateItem(map, { ...item, children }));
	}

	function toggleExpand(item: Item) {
		submitMap(updateItem(map, { ...item, isExpanded: !item.isExpanded }));
	}

	function moveOrAddItem(movedItemId: string, targetParentId: string, targetSiblingIndex: number) {
		if (!map) {
			throw new Error("Map not found");
		}
		if (!findChildById(map, movedItemId)) {
			console.log("adding item", movedItemId, targetParentId, targetSiblingIndex);
			// add a new Item
			setAddingItemId(movedItemId);
			submitMap(
				addNewItem(targetParentId, map, createNewItem("", movedItemId), targetSiblingIndex),
			);
		} else {
			submitMap(moveItem(movedItemId, targetParentId, targetSiblingIndex, map));
		}
	}

	return (
		<mapControllerContext.Provider
			value={{
				updateItemText,
				updateChildren,
				toggleExpand,
				removeItem,
				moveOrAddItem,
				addingItemId,
				setAddingItemId,
			}}
		>
			{children}
		</mapControllerContext.Provider>
	);
};
