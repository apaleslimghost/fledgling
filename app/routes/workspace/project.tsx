import database from "~/data/rxdb.client";
import type { Route } from "./+types/project";
import { Link } from "react-router";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const [project, notes] = await Promise.all([
		database.projects.findOne({ selector: { id: params.projectId } }).exec(true),
		database.notes.find({ selector: { projects: { $elemMatch: { $eq: params.projectId } } } }).exec(),
	])
	return {
		project,
		notes
	}
}

export default function Project({ loaderData: { project, notes }, params }: Route.ComponentProps) {
	return <div className="grid">
		<h1>{project.title}</h1>
		{notes.map(note => <div className="card surface mid" key={note.id}>
			<h2>
				<Link to={`/workspace/${params.workspaceId}/note/${note.id}`}>
					{note.title}
				</Link>
			</h2>
		</div>)}
	</div>
}
