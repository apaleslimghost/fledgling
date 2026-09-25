import type { Route } from "../+types/home";
import { useQuery } from "@rocicorp/zero/react";
import { queries } from "~/zero/queries";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	const [notes] = useQuery(queries.note.all())

	return <ul>
		{notes.map(note => <li key={note.id}><a href={`/note/${note.id}`}>{note.title || <em>Untitled note</em>}</a></li>)}
	</ul>;
}
