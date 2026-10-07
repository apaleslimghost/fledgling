import type { Note } from "~/data/schema";
import Editor from "./editor";
import { Link } from "react-router";
import { useWorkspace } from "~/data/context";

export default ({ note }: { note: Note }) => {
	const workspaceId = useWorkspace()
	return <Link to={`/workspace/${workspaceId}/note/${note.id}`}>
		<div className="card surface mid">
			<Editor id={note.id} editable={false} content={note.content} />
		</div>
	</Link>
}
