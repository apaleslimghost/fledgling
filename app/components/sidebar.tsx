import { useNavigate } from "react-router";
import { shortId } from "~/data/cuid";
import database from "~/data/rxdb.client";
import type { Project, Tag } from "~/data/schema";

export function Sidebar({
	tags,
	projects,
	workspaceId
}: {
	tags: Tag[],
	projects: Project[],
	workspaceId: string
}) {
	const navigate = useNavigate()

	return (
		<aside>
			<button onClick={async () => {
				const id = shortId()
				await database.notes.insert({
					id,
					title: '',
					content: {},
					tags: [],
					projects: [],
					workspace: workspaceId
				})
				navigate(`/workspace/${workspaceId}/note/${id}`)
			}} className="surface lo">+ new note</button>

			<menu>
				{tags ? tags.map((tag) => (
					<li key={tag.id}>
						<a href={`/workspace/${workspaceId}/tag/${tag.id}`}>#{tag.path}</a>
					</li>
				)) : <li className="placeholder">loading tags</li>}
			</menu>

			<menu>
				{projects ? projects.map((project) => (
					<li key={project.id}>
						<a href={`/workspace/${workspaceId}/project/${project.id}`}>@{project.title}</a>
					</li>
				)) : <li className="placeholder">loading projects</li>}
			</menu>
		</aside>
	);
}
