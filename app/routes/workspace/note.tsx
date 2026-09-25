import type { Route } from "../+types/note";
import Editor from "~/components/editor";
import type { Content, JSONContent } from "@tiptap/react";
import type { MentionNodeAttrs } from "@tiptap/extension-mention";
import { queries } from "~/zero/queries";
import { useQuery, useZero } from "@rocicorp/zero/react";
import { mutators } from "~/zero/mutators";

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
	const zero = useZero()
	const [note, noteResult] = useQuery(queries.note.byId({ id: params.noteId }))

	if (!note) {
		if (noteResult.type === 'complete') {
			throw new Error(`Note ${params.noteId} not found`)
		} else {
			return null
		}
	}

	return (
		<article className="card surface hi">
			<h1>
				<input value={note.title ?? ''} onChange={async (e) => {
					zero.mutate(mutators.note.setTitle({ id: params.noteId, title: e.target.value }))
				}} placeholder="Untitled note" autoFocus={!note.title} />
			</h1>

			<Editor content={note.content as Content} id={note.id}
				onDelete={async (mutation) => {
					if (mutation.type === 'node') {
						if (mutation.node.type.name === 'mention' && mutation.node.attrs.id) {
							zero.mutate(mutators.tag.removeAndMaybeCleanUp({ noteId: note.id, id: mutation.node.attrs.id }))
						}
					}
				}}
				onUpdate={async ({ editor }) => {
					const result = editor.getJSON() as JSONContent

					const bodyTags = Array.from(collect<MentionNode>('mention', result)).filter(
						(node) => node.attrs.mentionSuggestionChar === '#' && node.attrs.id
					)

					const tagIds = bodyTags.map(t => t.attrs.id).filter((id): id is string => !!id)

					zero.mutate(mutators.note.setContent({ id: params.noteId, content: result, tagIds }))
				}} />
		</article>
	);
}
