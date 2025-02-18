import { Button } from "./Button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./Tooltip";

export function TooltipButton(
	props: React.ComponentProps<typeof Button> & {
		tooltip: React.ReactNode;
	},
) {
	return (
		<TooltipProvider delayDuration={300}>
			<Tooltip>
				<TooltipTrigger>
					<Button {...props} />
				</TooltipTrigger>
				<TooltipContent>{props.tooltip}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
