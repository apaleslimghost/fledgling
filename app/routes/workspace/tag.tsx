import database from "~/data/rxdb.client";
import type { Route } from "./+types/tag";
import { Link } from "react-router";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const path = params['*']

	const tagWithDescendents = await database.tags.find({
		selector: {
			path: {
				$regex: new RegExp(`^${path}`).source
			}
		}
	}).exec()

	const notes = await database.notes.find({
		selector: {
			tags: {
				$in: tagWithDescendents.map(t => t.id)
			}
		}
	}).exec()

	const projects = await database.projects.find({
		selector: {
			id: {
				$in: notes.flatMap(note => note.projects)
			}
		}
	}).exec()

	return {
		tagWithDescendents,
		notes,
		projects,
	}
}

export default function Tag({ loaderData: { notes, projects }, params }: Route.ComponentProps) {
	const pathParts = params['*'].split('/')

	return <div className="grid">
		<h1>
			{pathParts.map((part, index) => (
				<span key={pathParts.slice(0, index + 1).join('/')}>
					{index === pathParts.length - 1 ? (
						part
					) : (
						<>
							<Link to={`/workspace/${params.workspaceId}/tag/${pathParts.slice(0, index + 1).join('/')}`}>
								{index === 0 ? '#' : ''}
								{part}
							</Link>
							{index === pathParts.length - 1 ? null : <span>/</span>}
						</>
					)}
				</span>
			))}
		</h1>
		{notes.map(note => <div className="card surface mid" key={note.id}>
			<h2>
				<Link to={`/workspace/${params.workspaceId}/note/${note.id}`}>
					{note.title}
				</Link>
			</h2>
		</div>)}
		{projects.map(project => <div className="card surface mid" key={project.id}>
			<h2>
				<Link to={`/workspace/${params.workspaceId}/project/${project.id}`}>
					@{project.title}
				</Link>
			</h2>
		</div>)}
	</div>
}
