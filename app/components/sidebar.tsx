import { useDb } from "jazz-tools/react";
import { app } from "../../schema";
import { useNavigate } from "react-router";

export function Sidebar() {
	const db = useDb()
	const navigate = useNavigate()

	return (
		<aside>
			<button onClick={async () => {
				const pending = db.insert(app.notes, { title: '', content: {} })
				const note = await pending.wait({ tier: 'local' })
				navigate(`/note/${note.id}`)
			}}>+ new note</button>
		</aside>
	);
}
