import { useAll } from "jazz-tools/react";
import type { Route } from "./+types/note";
import { app } from "../../schema";

export default function Note({ params }: Route.ComponentProps) {
	const [note] = useAll(app.notes.where({ id: params.id })) ?? []

	return (
		<article className="card">
			<h1>{note?.title}</h1>
			<p>{JSON.stringify(note?.content)}</p>
		</article>
	);
}
