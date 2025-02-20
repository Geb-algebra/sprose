import { z } from "zod";

const baseItemSchema = z.object({
	id: z.string(),
	description: z.string(),
	isExpanded: z.boolean(),
});

export type Item = z.infer<typeof baseItemSchema> & { children: Item[] };

export const itemSchema: z.ZodType<Item> = baseItemSchema.extend({
	children: z.lazy(() => itemSchema.array()),
});

export type MapData = {
	mapHistory: Item[];
	currentMapIndex: number;
};
