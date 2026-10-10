import { Link, NavLink, useNavigate } from "react-router";
import { shortId } from "~/data/cuid";
import database from "~/data/rxdb.client";
import type { Project, Tag } from "~/data/schema";
import TagTreeComponent from "./tag-tree";
import type { TagWithNotes } from "~/lib/tag-tree";
import { Icon } from "./icon";
import { QrCode } from "./qr-code";

export function Sidebar({
	tags,
	projects,
	workspaceId
}: {
	tags: TagWithNotes[],
	projects: Project[],
	workspaceId: string
}) {
	const navigate = useNavigate()

	return (
		<aside>
			<div className="toolbar">
				<button onClick={async () => {
					const id = shortId()
					await database.notes.insert({
						id,
						content: {},
						tags: [],
						projects: [],
						tasks: [],
						workspace: workspaceId
					})
					navigate(`/workspace/${workspaceId}/note/${id}`)
				}} className="surface lo">
					<Icon icon='NoteAdd' />
					new note
				</button>

				<div className='tooltip'>
					<button className="secondary surface lo" popoverTarget={`qr-${workspaceId}`}>
						<Icon icon='QrCode' />
						connect
					</button>

					<div id={`qr-${workspaceId}`} popover='auto' className='card qr'>
						<QrCode data={`https://👻🪺.ws/w/${workspaceId}`} />
						<small>
							this QR code gives full write access to this workspace
						</small>
					</div>
				</div>
			</div>

			<menu>
				{tags ? <TagTreeComponent tags={tags} /> : <li className="placeholder">loading tags</li>}
			</menu>

			<menu>
				{projects ? projects.map((project) => (
					<li key={project.id}>
						<NavLink to={`/workspace/${workspaceId}/project/${project.id}`}>
							<Icon icon='FolderKanban' />
							{project.title}
						</NavLink>
					</li>
				)) : <li className="placeholder">loading projects</li>}
			</menu>
		</aside>
	);
}
