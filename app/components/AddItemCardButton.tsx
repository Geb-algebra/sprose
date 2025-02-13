import React from "react";
import { cn } from "~/utils/css";

type AddItemCardButtonProps = {
	onClick: () => void;
	className?: string;
};

export default function AddItemCardButton({
	onClick,
	className,
}: AddItemCardButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"w-48 h-16 mr-2 mb-2 grid place-content-center bg-transparent rounded-md transition-colors",
				"border-2 border-dashed border-slate-100 hover:border-slate-400 focus-visible:border-slate-400",
				"text-2xl text-slate-100 hover:text-slate-400 focus-visible:text-slate-400 ",
				className,
			)}
		>
			+
		</button>
	);
}
