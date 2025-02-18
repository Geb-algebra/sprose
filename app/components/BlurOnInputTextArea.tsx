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
			// optimistic description update
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
			// biome-ignore lint: should autofocus
			autoFocus
		/>
	);
}
