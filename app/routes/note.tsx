import { useAll } from "jazz-tools/react";
import type { Route } from "./+types/note";
import { app } from "../../schema";

export default function Note({ params }: Route.ComponentProps) {
	const [note] = useAll(app.notes.where({ id: params.id })) ?? []

	return (
		<div>
			<h1>Note</h1>
			<p>{note?.title}</p>
			<p>{JSON.stringify(note?.content)}</p>
		</div>
	);
}
