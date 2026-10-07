import NoteCard from "~/components/note-card";
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
	return <div className="grid">
		{notes.map(note => <NoteCard note={note} key={note.id} />)}
	</div>
}
