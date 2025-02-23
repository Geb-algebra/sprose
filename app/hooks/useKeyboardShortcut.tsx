import { useEffect } from "react";

type ModifierKey = "ctrl" | "shift" | "alt" | "meta";

type KeyBinding = {
	mainKey: string;
	requiredModifiers: {
		ctrl: boolean;
		shift: boolean;
		alt: boolean;
		meta: boolean;
	};
};

export function useKeyboardShortcut(keyCombos: string[], callback: (e: KeyboardEvent) => void) {
	useEffect(() => {
		const modifierKeys: ModifierKey[] = ["ctrl", "shift", "alt", "meta"];
		const keyBindings: KeyBinding[] = keyCombos
			.map((combo) => {
				const keys = combo
					.toLowerCase()
					.split("+")
					.map((k) => k.trim());
				const requiredModifiers = {
					ctrl: keys.includes("ctrl"),
					shift: keys.includes("shift"),
					alt: keys.includes("alt"),
					meta: keys.includes("meta"),
				};
				// Exclude modifier keys to get the main key
				const mainKeys = keys.filter((key) => !modifierKeys.includes(key as ModifierKey));
				if (mainKeys.length !== 1) {
					console.warn(`useKeyboardShortcut expects exactly one non-modifier key in "${combo}".`);
					return null;
				}
				return { mainKey: mainKeys[0], requiredModifiers };
			})
			.filter((binding): binding is KeyBinding => binding !== null);

		if (keyBindings.length === 0) {
			return;
		}

		const keyHandler = (e: KeyboardEvent) => {
			e.preventDefault();
			for (const binding of keyBindings) {
				if (
					e.key.toLowerCase() === binding.mainKey &&
					e.ctrlKey === binding.requiredModifiers.ctrl &&
					e.shiftKey === binding.requiredModifiers.shift &&
					e.altKey === binding.requiredModifiers.alt &&
					e.metaKey === binding.requiredModifiers.meta
				) {
					callback(e);
					break;
				}
			}
		};

		window.addEventListener("keydown", keyHandler);
		return () => {
			window.removeEventListener("keydown", keyHandler);
		};
	}, [keyCombos, callback]);
}
