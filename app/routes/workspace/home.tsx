import type { Route } from "./+types/home";
import database from "~/data/rxdb.client";

export function clientLoader({ params }: Route.ComponentProps) {
	return database.notes.find({
		selector: {
			workspace: params.workspaceId
		}
	}).exec()
}

export default function Home({ loaderData: notes, params }: Route.ComponentProps) {
	return <ul>
		{notes.map(note => <li key={note.id}><a href={`/workspace/${params.workspaceId}/note/${note.id}`}>{note.title || <em>Untitled note</em>}</a></li>)}
	</ul>;
}
