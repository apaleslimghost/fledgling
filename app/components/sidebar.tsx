import { Link, NavLink, useNavigate } from "react-router";
import { shortId } from "~/data/cuid";
import database from "~/data/rxdb";
import type { Project, Session, Tag } from "~/data/schema";
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
						<Icon icon='FolderTransfer' />
						workspace
					</button>

					<div id={`qr-${workspaceId}`} popover='auto' className='card qr'>
						<QrCode data={`https://fledgling.today/w/${workspaceId}`} />
						<small>
							this QR code gives full write access to this workspace
						</small>

						<hr />

						<div className="toolbar">
							<button className="secondary" onClick={async () => {
								const json = await database.exportJSON()
								const blob = new Blob([
									JSON.stringify(json)
								], {
									type: 'application/json'
								})

								const a = document.createElement('a')
								a.download = `flegdling-${workspaceId}-${Date.now()}.json`
								a.href = URL.createObjectURL(blob)
								a.click()

								requestIdleCallback(() => {
									URL.revokeObjectURL(a.href)
								})
							}}>
								<Icon icon='HardDriveDownload' /> export
							</button>

							<button className="secondary" onClick={async () => {
								const input = document.createElement('input')
								input.type = 'file'
								input.accept = 'application/json'

								input.addEventListener('change', () => {
									const [file] = input.files ?? []
									if (!file) return

									const reader = new FileReader();
									reader.readAsText(file, 'UTF-8');
									reader.addEventListener('load', async () => {
										const content = reader.result
										if (!(typeof content === 'string')) return

										const json = JSON.parse(content)
										if (!('collections' in json)) {
											alert('Invalid Fledgling export')
											return
										}

										json.collections = json.collections.filter(
											collection => collection.name !== 'workspaces'
										)

										for (const collection of json.collections) {
											for (const doc of collection.docs) {
												if (doc.workspace) {
													doc.workspace = workspaceId
												}
											}
										}

										await database.importJSON(json)
									}, { once: true })
								}, { once: true })

								input.click()
							}}>
								<Icon icon='HardDriveUpload' /> import
							</button>

							<button className='button danger' onClick={async () => {
								const session = await database.getLocal<Session>('session')
								await session?.remove()
								navigate('/')
							}}>
								<Icon icon='BookX' />
								close
							</button>
						</div>
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
