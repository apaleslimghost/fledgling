import database from "~/data/rxdb.client";
import type { Route } from "./+types/tag";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const [tag, notes] = await Promise.all([
		database.tags.findOne({ selector: { id: params.tagId } }).exec(true),
		database.notes.find({ selector: { tags: { $elemMatch: { $eq: params.tagId } } } }).exec(),
	])
	return {
		tag,
		notes
	}
}

export default function Tag({ loaderData: { tag, notes } }: Route.ComponentProps) {
	return <div className="grid">
		{notes.map(note => <div className="card surface mid" key={note.id}>
			<h2>{note.title}</h2>
		</div>)}
	</div>
}
