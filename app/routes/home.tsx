import type { Route } from "./+types/home";
import { useAll, useDb } from "jazz-tools/react";
import { app } from "../../schema";
import { useState } from "react";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	const db = useDb()
	const notes = useAll(app.notes) ?? []
	const [title, setTitle] = useState("")

	return <ul>
		<li>
			<input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
			<button onClick={() => db.insert(app.notes, { title, content: {} })}>Add</button>
		</li>
		{notes.map(note => <li key={note.id}><a href={`/note/${note.id}`}>{note.title}</a></li>)}
	</ul>;
}
