import { UploadIcon } from "lucide-react";
import { useFetcher } from "react-router";
import { Button } from "~/components/Button";
import { MapRepository } from "~/map/lifecycle";
import { parseMarkdownToItems } from "~/map/services";
import type { Route } from "./+types/import-markdown";

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const markdownFile = formData.get("markdownFile");
	if (!(markdownFile instanceof File)) {
		return { error: "Invalid file input, expected a File." };
	}
	const fileText = await markdownFile.text();
	await MapRepository.save(parseMarkdownToItems(fileText));
	return { success: true };
}

export function ImportMarkdownButton(props: { className?: string }) {
	const fetcher = useFetcher();

	return (
		<fetcher.Form
			method="post"
			action="/import-markdown"
			encType="multipart/form-data"
		>
			<input
				type="file"
				name="markdownFile"
				accept=".md"
				id="markdownFile"
				style={{ display: "none" }}
				onChange={(e) => {
					if (e.currentTarget.files && e.currentTarget.files.length > 0) {
						fetcher.submit(
							new FormData(e.currentTarget.form as HTMLFormElement),
							{ method: "post", encType: "multipart/form-data" },
						);
					}
				}}
			/>
			<Button
				type="button"
				onClick={() => document.getElementById("markdownFile")?.click()}
				variant="ghost"
				size="icon"
				className={props.className}
			>
				<UploadIcon />
			</Button>
		</fetcher.Form>
	);
}
