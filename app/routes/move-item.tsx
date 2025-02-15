import { MapRepository } from "~/map/lifecycle";
import { moveItem } from "~/map/services";
import type { Route } from "./+types/move-item";

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const movedItemId = formData.get("movedItemId");
	const targetParentId = formData.get("targetParentId");
	const targetSiblingIndexStr = formData.get("targetSiblingIndex");
	if (
		typeof movedItemId !== "string" ||
		typeof targetParentId !== "string" ||
		typeof targetSiblingIndexStr !== "string"
	) {
		throw new Error("Invalid form data");
	}
	const targetSiblingIndex = Number(targetSiblingIndexStr);
	const map = await MapRepository.get();
	const newMap = moveItem(movedItemId, targetParentId, targetSiblingIndex, map);
	await MapRepository.save(newMap);
	return null;
}
