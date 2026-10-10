import database from "~/data/rxdb.client";
import type { Route } from "./+types/project";
import { Link, NavLink } from "react-router";
import Editor from "~/components/editor";
import NoteCard from "~/components/note-card";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const [project, notes] = await Promise.all([
		database.projects.findOne({ selector: { id: params.projectId } }).exec(true),
		database.notes.find({ selector: { projects: { $elemMatch: { $eq: params.projectId } } } }).exec(),
	])

	const tasks = await database.tasks.find({ selector: { note: { $in: notes.map(note => note.id) } } }).exec()

	return {
		project,
		notes,
		tasks
	}
}

export default function Project({ loaderData: { project, notes, tasks }, params }: Route.ComponentProps) {
	return <div>
		<title>{`@${project.title}`}</title>
		<h1>
			<NavLink to={`/workspace/${params.workspaceId}/project/${project.id}`}>
				@{project.title}
			</NavLink>
		</h1>
		<div className="grid">
			<div className="card surface mid">
				<ul>
					{tasks.map(task => <li key={task.id}>
						<Link to={`/workspace/${params.workspaceId}/note/${task.note}/${task.id}`}>
							<Editor id={task.id} content={task.content} editable={false} />
						</Link>
					</li>)}
				</ul>
			</div>

			{notes.map(note => <NoteCard key={note.id} note={note} />)}
		</div>
	</div>
}
