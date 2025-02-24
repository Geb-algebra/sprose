import { cleanup, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useKeyboardShortcut } from "./useKeyboardShortcut";

describe("useKeyboardShortcut", () => {
	afterEach(() => {
		cleanup();
	});

	it("calls callback for matching key combination (ctrl+a)", async () => {
		const callback = vi.fn();
		renderHook(() => useKeyboardShortcut(["ctrl+a"], callback));

		const user = userEvent.setup();
		// Simulate pressing Control+a. The syntax sends control modifiers.
		await user.keyboard("{Control>}a{/Control}");
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it("does not call callback for non-matching key combination", async () => {
		const callback = vi.fn();
		renderHook(() => useKeyboardShortcut(["ctrl+a"], callback));

		const user = userEvent.setup();
		// Press "a" without control
		await user.keyboard("a");
		expect(callback).not.toHaveBeenCalled();
	});

	it("supports multiple key combinations", async () => {
		const callback = vi.fn();
		renderHook(() => useKeyboardShortcut(["ctrl+a", "shift+b"], callback));

		const user = userEvent.setup();
		// Trigger ctrl+a
		await user.keyboard("{Control>}a{/Control}");
		// Trigger shift+b
		await user.keyboard("{Shift>}b{/Shift}");
		expect(callback).toHaveBeenCalledTimes(2);
	});

	it("calls callback only once per event when duplicate combos are provided", async () => {
		const callback = vi.fn();
		renderHook(() => useKeyboardShortcut(["ctrl+a", "ctrl+a"], callback));

		const user = userEvent.setup();
		await user.keyboard("{Control>}a{/Control}");
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it("removes event listener on unmount", async () => {
		const callback = vi.fn();
		const { unmount } = renderHook(() => useKeyboardShortcut(["ctrl+a"], callback));

		unmount();
		const user = userEvent.setup();
		await user.keyboard("{Control>}a{/Control}");
		expect(callback).not.toHaveBeenCalled();
	});

	it("warns when provided an invalid key combo", async () => {
		const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
		const callback = vi.fn();
		renderHook(() => useKeyboardShortcut(["ctrl+a+b"], callback));

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining("useKeyboardShortcut expects exactly one non-modifier key"),
		);
		consoleWarnSpy.mockRestore();
	});
});
