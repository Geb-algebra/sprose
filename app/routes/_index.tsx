import { Link } from "react-router";

export async function loader() {
	console.log("hello from loader");
	return null;
}

export function meta() {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	return (
		<Link to="prerendered" className="font-bold text-destructive">
			Go to prerendered page
		</Link>
	);
}
