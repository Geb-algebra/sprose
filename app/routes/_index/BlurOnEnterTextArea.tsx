import { useState } from "react";
import { cn } from "~/utils/css";

export function BlurOnEnterTextArea(props: {
	onBlur: React.FocusEventHandler<HTMLTextAreaElement>;
	nextElement?: HTMLButtonElement | null;
	defaultValue?: string;
	className?: string;
}) {
	const [isComposing, setIsComposing] = useState(false);

	return (
		<textarea
			className={cn(
				props.className,
				"h-9", // prevents default height being 56px
			)}
			defaultValue={props.defaultValue}
			onBlur={props.onBlur}
			onCompositionStart={() => setIsComposing(true)}
			onCompositionEnd={() => setIsComposing(false)}
			onKeyDown={(e) => {
				if (e.key === "Enter" && !e.shiftKey && !isComposing) {
					e.preventDefault();
					e.currentTarget.blur();
					props.nextElement?.focus();
				}
			}}
			onFocus={(e) => {
				console.log(e.currentTarget.clientHeight);
				e.currentTarget.style.height = `${Math.max(e.currentTarget.scrollHeight)}px`;
			}}
			onInput={(e) => {
				e.currentTarget.style.height = `${Math.max(e.currentTarget.scrollHeight)}px`;
			}}
			// biome-ignore lint: should autofocus
			autoFocus
		/>
	);
}
