import { useAll, useDb } from "jazz-tools/react";
import type { Route } from "./+types/note";
import { app } from "../../schema";
import Editor from "~/components/editor";
import type { Content, JSONContent } from "@tiptap/react";
import type { JsonValue } from "jazz-tools";
import type { MentionNodeAttrs } from "@tiptap/extension-mention";

interface MentionNode extends JSONContent {
	type: 'mention'
	attrs: MentionNodeAttrs
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
	const notes = useAll(app.notes.where({ id: params.id }), { tier: 'local' })
	const db = useDb()

	if (!notes || notes.length === 0) {
		return <article className="card surface hi placeholder">
			<h1>Loading a note</h1>
			{Array.from({ length: Math.floor(5 * Math.random() + 1) }, (_, i) => i).map((i) => <p key={i}>
				{Array.from({ length: Math.floor(10 * Math.random() + 10) }, () => Array.from({ length: Math.floor(10 * Math.random() + 3) }, () => String.fromCharCode(Math.floor(97 + Math.random() * 26))).join('')).join(' ')}
			</p>)}
		</article>
	}

	const note = notes[0]!

	return (
		<article className="card surface hi">
			<h1>
				<input value={note.title ?? ''} onChange={async (e) => {
					db.update(app.notes, note.id, { title: e.target.value })
				}} placeholder="Untitled note" autoFocus={!note.title} />
			</h1>

			<Editor content={note.content as Content} id={note.id}
				onDelete={async (mutation) => {
					if (mutation.type === 'node' && mutation.node.type.name === 'mention' && mutation.node.attrs.id) {
						const [tag] = await db.all(app.tags.where({ id: mutation.node.attrs.id }).include({
							notesViaTags: app.notes
						}))

						if (tag?.notesViaTags.length === 0) {
							db.delete(app.tags, tag.id)
						}
					}
				}}
				onUpdate={async ({ editor }) => {
					const result = editor.getJSON() as JSONContent

					const bodyTags = Array.from(collect<MentionNode>('mention', result)).filter(
						(node) => node.attrs.mentionSuggestionChar === '#' && node.attrs.id
					)

					const tagIds = bodyTags.map(t => t.attrs.id).filter((id): id is string => !!id)

					db.update(app.notes, note.id, {
						content: editor.getJSON() as JsonValue,
						tagIds,
					})
				}} />
		</article>
	);
}
