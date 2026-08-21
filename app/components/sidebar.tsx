import { useAll, useDb } from "jazz-tools/react";
import { app } from "../../schema";
import { useNavigate } from "react-router";

export function Sidebar() {
	const db = useDb()
	const navigate = useNavigate()

	const tags = useAll(app.tags)

	return (
		<aside>
			<button onClick={async () => {
				const pending = db.insert(app.notes, { title: '', content: {}, tagIds: [] })
				const note = await pending.wait({ tier: 'local' })
				navigate(`/note/${note.id}`)
			}} className="surface mid">+ new note</button>

			{tags && <ul>
				{tags.map((tag) => (
					<li key={tag.id}>
						<a href={`/tag/${tag.id}`}>#{tag.path}</a>
					</li>
				))}
			</ul>}
		</aside>
	);
}
