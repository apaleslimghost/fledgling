import { useAll } from "jazz-tools/react";
import type { Route } from "./+types/tag";
import { app } from "../../schema";

export default function Tag({ params }: Route.ComponentProps) {
	const notes = useAll(app.notes.where({ tagIds: { contains: params.id } }), { tier: 'local' }) ?? []

	return <div className="grid">
		{notes.map(note => <div className="card surface mid" key={note.id}>
			<h2>{note.title}</h2>
		</div>)}
	</div>
}
