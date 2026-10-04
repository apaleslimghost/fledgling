import database from "~/data/rxdb.client";
import type { Route } from "./+types/project";
import { Link, NavLink } from "react-router";

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
	return <div>
		<h1>
			<NavLink to={`/workspace/${params.workspaceId}/project/${project.id}`}>
				@{project.title}
			</NavLink>
		</h1>
		<div className="grid">

			{notes.map(note => <div className="card surface mid" key={note.id}>
				<h2>
					<Link to={`/workspace/${params.workspaceId}/note/${note.id}`}>
						{note.title}
					</Link>
				</h2>
			</div>)}
		</div>
	</div>
}
