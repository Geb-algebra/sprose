import { createContext, useState } from "react";
import type { Item } from "~/map/models";

export const mapContext = createContext<{
	map: Item | null;
	submitMap: (map: Item) => void;
}>({ map: null, submitMap: () => {} });

export const addingItemContext = createContext<{
	addingItemId: string | null;
	setAddingItemId: (addingItemId: string | null) => void;
}>({ addingItemId: null, setAddingItemId: () => {} });

export const AddingItemProvider = ({ children }: { children: React.ReactNode }) => {
	const [addingItemId, setAddingItemId] = useState<string | null>(null);
	return (
		<addingItemContext.Provider value={{ addingItemId, setAddingItemId }}>
			{children}
		</addingItemContext.Provider>
	);
};
