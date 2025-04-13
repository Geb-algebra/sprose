import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const focusVisibleStyle =
	"focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring outline-none";
export const cardShape = "w-60 min-h-9 h-auto rounded-lg";
export const inserterShape = (isExpanded: boolean) =>
	cn(cardShape, isExpanded ? "w-8 h-full" : "h-8 min-h-none");
