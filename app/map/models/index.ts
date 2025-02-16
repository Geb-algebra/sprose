export type Item = {
	id: string;
	description: string;
	isExpanded: boolean;
	children: Item[];
};

export type MapData = {
	mapHistory: Item[];
	currentMapIndex: number;
};
