import React from "react";
import { cn, focusVisibleStyle } from "~/utils/css";

export default function AddItemCardButton(props: {
	onFinishWriting: (description: string) => void;
	className: string;
}) {
	const [writing, setWriting] = React.useState(false);
	return writing ? (
		<textarea
			className={cn(
				"w-48 h-16 mr-2 mb-2 grid place-content-center bg-slate-100 rounded-md p-2 text-sm",
				focusVisibleStyle,
				props.className,
			)}
			onBlur={(e) => {
				props.onFinishWriting(e.target.value);
				setWriting(false);
			}}
			// biome-ignore lint: should autofocus
			autoFocus
		/>
	) : (
		<button
			type="button"
			onClick={() => {
				setWriting(true);
			}}
			className={cn(
				"w-48 h-16 mr-2 mb-2 grid place-content-center bg-transparent rounded-md transition-colors",
				"border-2 border-dashed border-slate-100 hover:border-slate-400 focus-visible:border-slate-400",
				"text-2xl text-slate-100 hover:text-slate-400 focus-visible:text-slate-400 ",
				props.className,
			)}
		>
			+
		</button>
	);
}
