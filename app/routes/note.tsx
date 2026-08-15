import { useAll, useDb } from "jazz-tools/react";
import type { Route } from "./+types/note";
import { app } from "../../schema";
import Editor from "~/components/editor";
import type { Content } from "@tiptap/react";
import type { JsonValue } from "jazz-tools";

export default function Note({ params }: Route.ComponentProps) {
	const [note] = useAll(app.notes.where({ id: params.id })) ?? []
	const db = useDb()

	return (
		<article className="card">
			<h1><input value={note?.title ?? ''} onChange={async (e) => {
				if (note) {
					db.update(app.notes, note.id, { title: e.target.value })
				}
			}} /></h1>

			{note ?
				<Editor content={note.content as Content} id={note.id} onUpdate={({ editor }) => {
					db.update(app.notes, note.id, {
						content: editor.getJSON() as JsonValue
					})
				}} />
				: null}
		</article>
	);
}
