import { expect } from "vitest";
import { generateId } from "../lifecycle";
import type { Item } from "../models";

export const _item = (item: Partial<Item>) => ({
	id: item.id ?? generateId(),
	description: item.description ?? "",
	isExpanded: item.isExpanded ?? false,
	children: item.children ?? [],
});

export const _expectedItem = (item: Partial<Item>) => ({
	id: expect.any(String),
	description: item.description ?? expect.any(String),
	isExpanded: item.isExpanded ?? expect.any(Boolean),
	children: item.children ?? expect.any(Array),
});

export const _rootItem = (children: Item[] = []) => ({
	id: "__root",
	description: "",
	isExpanded: true,
	children,
});
