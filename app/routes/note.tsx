import { useAll, useDb } from "jazz-tools/react";
import type { Route } from "./+types/note";
import { app } from "../../schema";
import { useState } from "react";

export default function Note({ params }: Route.ComponentProps) {
	const [note] = useAll(app.notes.where({ id: params.id })) ?? []
	const db = useDb()

	return (
		<article className="card">
			<h1><input value={note?.title} onChange={async (e) => {
				if (note) {
					db.update(app.notes, note.id, { title: e.target.value })
				}
			}} /></h1>
			<p>{JSON.stringify(note?.content)}</p>
		</article>
	);
}
