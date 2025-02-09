import type { Route } from "./+types/prerendered";

export async function loader({ request }: Route.LoaderArgs) {
	return "hello";
}

export default function P({ loaderData }: Route.ComponentProps) {
	return <>{loaderData}</>;
}
