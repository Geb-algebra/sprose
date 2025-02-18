import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const focusVisibleStyle =
	"focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring outline-none";

export const cardShape = "w-56  min-h-20 h-auto rounded-lg";
