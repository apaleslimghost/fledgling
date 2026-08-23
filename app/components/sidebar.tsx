import { useAll, useDb } from "jazz-tools/react";
import { app } from "../../schema";
import { useNavigate } from "react-router";

export function Sidebar() {
	const db = useDb()
	const navigate = useNavigate()

	const tags = useAll(app.tags)
	const projects = useAll(app.projects)

	return (
		<aside>
			<button onClick={async () => {
				const pending = db.insert(app.notes, { title: '', content: {}, tagIds: [], projectIds: [] })
				const note = await pending.wait({ tier: 'local' })
				navigate(`/note/${note.id}`)
			}} className="surface lo">+ new note</button>

			{tags && <ul>
				{tags.map((tag) => (
					<li key={tag.id}>
						<a href={`/tag/${tag.id}`}>#{tag.path}</a>
					</li>
				))}
			</ul>}

			{projects && <ul>
				{projects.map((project) => (
					<li key={project.id}>
						<a href={`/project/${project.id}`}>{project.title}</a>
					</li>
				))}
			</ul>}
		</aside>
	);
}
