import type { Route } from "./+types/tag";
import { useQuery } from "@rocicorp/zero/react";
import { queries } from "~/zero/queries";

export default function Tag({ params }: Route.ComponentProps) {
	const [tag] = useQuery(queries.tag.byId({ id: params.id }))
	const notes = tag?.notes ?? []

	return <div className="grid">
		{notes.map(note => <div className="card surface mid" key={note.id}>
			<h2>{note.title}</h2>
		</div>)}
	</div>
}
