import database from "~/data/rxdb.client";
import type { Route } from "./+types/tag";
import { Link, NavLink } from "react-router";
import { Icon } from "~/components/icon";
import NoteCard from "~/components/note-card";

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

	return <div>
		<h1 className='tag-path'>
			{pathParts.map((part, index) => (
				<span key={pathParts.slice(0, index + 1).join('/')}>
					<>
						<NavLink end to={`/workspace/${params.workspaceId}/tag/${pathParts.slice(0, index + 1).join('/')}`}>
							{index === 0 ? <Icon icon='Hashtag' /> : ''}
							{part}
						</NavLink>
						{index === pathParts.length - 1 ? null : <span>/</span>}
					</>
				</span>
			))}
		</h1>
		<div className="grid">
			{notes.map(note => <NoteCard key={note.id} note={note} />)}
			{projects.map(project => <div className="card surface mid" key={project.id}>
				<h2>
					<Link to={`/workspace/${params.workspaceId}/project/${project.id}`}>
						@{project.title}
					</Link>
				</h2>
			</div>)}
		</div>
	</div>
}
