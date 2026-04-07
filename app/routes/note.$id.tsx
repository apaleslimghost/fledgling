import { parseFormData, validationError } from '@rvf/react-router'
import type { MentionNodeAttrs } from '@tiptap/extension-mention'
import type { EditorEvents, JSONContent } from '@tiptap/react'
import debounce from 'lodash/debounce'
import { useMemo } from 'react'
import { useFetcher } from 'react-router'
import { type UseRxQueryOptions, useLiveRxQuery, useRxQuery } from 'rxdb/plugins/react'
import { z } from 'zod/v4'
import Editor from '~/components/editor'
import type { Note, NoteDocument } from '~/lib/rx-types'
import database from '~/lib/rxdb.client'
import type { Route } from './+types/note.$id'

const ActionSchema = z.object({
	text: z.string().transform((text) => JSON.parse(text) as JSONContent),
})

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

export async function clientAction({ request, params }: Route.ClientActionArgs) {
	const result = await parseFormData(request, ActionSchema)

	if (result.error) {
		return validationError(result.error, result.submittedData)
	}

	const tags = Array.from(
		collect<MentionNode>('mention', result.data.text),
		(node) => node.attrs.id,
	).filter((tag) => tag !== null)

	const note = await database.notes
		.findOne({
			selector: {
				id: params.id,
			},
		})
		.exec(true)

	await note.patch({
		...result.data,
		tags,
	})

	await database.tags.bulkUpsert(tags.map((tag) => ({ path: tag })))

	const allNotes = await database.notes.find().exec()

	const allTags = Array.from(new Set(allNotes.flatMap((note) => note.tags)))

	await database.tags
		.find({
			selector: {
				path: {
					$nin: allTags,
				},
			},
		})
		.remove()

	return { ok: true }
}

export default function NotePage(props: Route.ComponentProps) {
	const query: UseRxQueryOptions<Note> = useMemo(
		() => ({
			collection: database.notes,
			query: {
				selector: {
					id: props.params.id,
				},
			},
		}),
		[props.params.id],
	)

	const {
		results: [note],
		loading,
	} = useRxQuery(query)

	const fetcher = useFetcher()

	const onChange = useMemo(
		() =>
			debounce(({ editor }: EditorEvents['update']) => {
				const formData = new FormData()
				formData.set('text', JSON.stringify(editor.getJSON()))
				fetcher.submit(formData, { method: 'post' })
			}, 200),
		[fetcher],
	)

	// TODO: loading is never actually true
	// https://github.com/pubkey/rxdb/pull/8292
	if (loading || !note) {
		return <span>loading...</span>
	}

	return <Editor onUpdate={onChange} content={note.text ?? undefined} autofocus={!note.text} />
}
