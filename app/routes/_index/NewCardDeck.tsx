import { createNewItem } from "~/map/lifecycle";
import { Dragger } from "~/routes/_index/DragDrop";
import { cardShape, cn } from "~/utils/css";

export function NewCardDeck(props: {
	className?: string;
}) {
	return (
		<div className={cn("p-2 h-full w-fit bg-background rounded-xl shadow-sm", props.className)}>
			<Dragger item={createNewItem("")}>
				<div
					className={cn(
						cardShape,
						"bg-card border rounded-lg shadow-sm text-muted-foreground/50 text-sm p-2",
					)}
				>
					Drag/Drop this to add a new card
				</div>
			</Dragger>
		</div>
	);
}
