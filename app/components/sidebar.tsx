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

			{tags ? <menu>
				{tags.map((tag) => (
					<li key={tag.id}>
						<a href={`/tag/${tag.id}`}>#{tag.path}</a>
					</li>
				))}
			</menu> :
				<menu className="placeholder">
					<li><span>{Array.from({ length: Math.floor(10 * Math.random() + 3) }, () => String.fromCharCode(Math.floor(97 + Math.random() * 26)))}</span></li>
				</menu>}

			{projects ? <menu>
				{projects.map((project) => (
					<li key={project.id}>
						<a href={`/project/${project.id}`}>@{project.title}</a>
					</li>
				))}
			</menu> :
				<menu className="placeholder">
					<li><span>{Array.from({ length: Math.floor(10 * Math.random() + 3) }, () => String.fromCharCode(Math.floor(97 + Math.random() * 26)))}</span></li>
				</menu>}
		</aside>
	);
}
