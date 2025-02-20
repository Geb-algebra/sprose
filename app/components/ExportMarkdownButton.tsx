import { DownloadIcon } from "lucide-react";
import { Button } from "~/components/Button";
import { MapRepository } from "~/map/lifecycle";
import { serializeItemToMarkdown } from "~/map/services";
import { TooltipButton } from "./TooltipButton";

export function ExportMarkdownButton(props: { className?: string }) {
	const handleExport = async () => {
		const map = await MapRepository.get();
		const markdownText = serializeItemToMarkdown(map);
		const blob = new Blob([markdownText], { type: "text/markdown" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "exported-markdown.md";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	return (
		<TooltipButton
			onClick={handleExport}
			variant="ghost"
			size="icon"
			className={props.className}
			tooltip="Export Markdown"
		>
			<DownloadIcon />
		</TooltipButton>
	);
}
