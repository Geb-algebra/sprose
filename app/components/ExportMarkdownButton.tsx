import { DownloadIcon } from "lucide-react";
import { Button } from "~/components/Button";
import { MapRepository } from "~/map/lifecycle";
import { serializeMapToMarkdown } from "~/map/services";

export function ExportMarkdownButton(props: { className?: string }) {
	const handleExport = async () => {
		const map = await MapRepository.get();
		const markdownText = serializeMapToMarkdown(map);
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
		<Button
			onClick={handleExport}
			variant="ghost"
			size="icon"
			className={props.className}
		>
			<DownloadIcon />
		</Button>
	);
}
