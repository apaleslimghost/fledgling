import type { Route } from "./+types/home";
import database from "~/data/rxdb.client";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export function clientLoader() {
	return database.notes.find().exec()
}

export default function Home({ loaderData: notes, params }: Route.ComponentProps) {
	return <ul>
		{notes.map(note => <li key={note.id}><a href={`/workspace/${params.workspaceId}/note/${note.id}`}>{note.title || <em>Untitled note</em>}</a></li>)}
	</ul>;
}
