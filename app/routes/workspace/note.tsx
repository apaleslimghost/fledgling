import type { Route } from "./+types/note";
import Editor from "~/components/editor";
import type { Content, JSONContent } from "@tiptap/react";
import type { MentionNodeAttrs } from "@tiptap/extension-mention";
import { useMemo } from "react";
import database from "~/data/rxdb.client";
import { useLiveRxQuery } from "rxdb/plugins/react";

interface MentionNode extends JSONContent {
	type: 'mention'
	attrs: MentionNodeAttrs
}

interface TaskNode extends JSONContent {
	type: 'taskItem'
	attrs: {
		checked: boolean
		id: string
	}
}

function isNode<T extends JSONContent>(type: T['type'], obj: unknown): obj is T {
	if (obj && typeof obj === 'object' && 'type' in obj && obj.type === type) {
		return true
	}

	return false
}

function* collect<T extends JSONContent>(type: T['type'], tree: JSONContent): Generator<T> {
	if (isNode<T>(type, tree)) {
		yield tree
	}

	for (const child of tree.content ?? []) {
		yield* collect(type, child)
	}
}

export default function Note({ params }: Route.ComponentProps) {
	const query = useMemo(() => ({ selector: { id: params.noteId } }), [params.noteId])
	const { results: [note] } = useLiveRxQuery({
		collection: database.notes,
		query,
	})

	if (!note) return null

	return (
		<article className="card surface hi">
			<h1>
				<input value={note.title} onChange={async (e) => {
					await note.patch({ title: e.target.value })
				}} placeholder="Untitled note" autoFocus={!note.title} />
			</h1>

			<Editor content={note.content as Content} id={note.id}
				onCreate={({ editor }) => {
					editor.commands.setTaskId(params.taskId)
				}}
				onDelete={async (mutation) => {
					if (mutation.type === 'node') {
						if (mutation.node.type.name === 'mention' && mutation.node.attrs.id) {
							await note.modify(n => {
								n.tags = n.tags.filter(t => t !== mutation.node.attrs.id)
								return n
							})

							const notesWithTag = await database.notes.find({ selector: { tags: mutation.node.attrs.id } }).exec()

							if (notesWithTag.length === 0) {
								await database.tags.find({ selector: { id: mutation.node.attrs.id } }).remove()
							}
						} else if (mutation.node.type.name === 'taskItem' && mutation.node.attrs.id) {
							await database.tasks.find({ selector: { id: mutation.node.attrs.id } }).remove()
						}
					}
				}}
				onUpdate={async ({ editor }) => {
					editor.commands.setTaskId(undefined)

					const content = editor.getJSON() as JSONContent

					const bodyTags = Array.from(collect<MentionNode>('mention', content)).filter(
						(node) => node.attrs.mentionSuggestionChar === '#' && node.attrs.id
					)

					const bodyProjects = Array.from(collect<MentionNode>('mention', content)).filter(
						(node) => node.attrs.mentionSuggestionChar === '@' && node.attrs.id
					)

					const bodyTasks = Array.from(collect<TaskNode>('taskItem', content))

					console.log(await database.tasks.bulkUpsert(bodyTasks.map(
						t => ({
							id: t.attrs.id,
							status: t.attrs.checked ? 'done' : 'todo',
							content: t,
							note: note.id
						})
					)))

					const tags = bodyTags.map(t => t.attrs.id).filter((id): id is string => !!id)
					const projects = bodyProjects.map(t => t.attrs.id).filter((id): id is string => !!id)
					const tasks = bodyTasks.map(t => t.attrs.id)

					await note.incrementalPatch({ content, tags, projects, tasks })
				}} />
		</article>
	);
}
