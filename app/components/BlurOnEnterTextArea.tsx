import { useState } from "react";

export function BlurOnEnterTextArea(props: {
	onBlur: React.FocusEventHandler<HTMLTextAreaElement>;
	defaultValue?: string;
	className?: string;
}) {
	const [isComposing, setIsComposing] = useState(false);

	return (
		<textarea
			className={props.className}
			defaultValue={props.defaultValue}
			onBlur={props.onBlur}
			onCompositionStart={() => setIsComposing(true)}
			onCompositionEnd={() => setIsComposing(false)}
			onKeyDown={(e) => {
				if (e.key === "Enter" && !e.shiftKey && !isComposing) {
					e.preventDefault();
					e.currentTarget.blur();
				}
			}}
			onFocus={(e) => {
				e.currentTarget.style.height = `${Math.max(e.currentTarget.scrollHeight, 80)}px`;
			}}
			onInput={(e) => {
				e.currentTarget.style.height = `${Math.max(e.currentTarget.scrollHeight, 80)}px`;
			}}
			// biome-ignore lint: should autofocus
			autoFocus
		/>
	);
}
