import { parseFormData, validationError } from '@rvf/react-router'
import type { MentionNodeAttrs } from '@tiptap/extension-mention'
import type { EditorEvents, JSONContent } from '@tiptap/react'
import debounce from 'lodash/debounce'
import { useMemo } from 'react'
import { useFetcher } from 'react-router'
import { z } from 'zod/v4'
import Editor from '~/components/editor'
import type { Route } from './+types/note.$id'

const ActionSchema = z.object({
	text: z.string().transform((text) => JSON.parse(text) as JSONContent),
})

const QuerySchema = z.object({
	id: z.coerce.number(),
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

export async function action({ request, params }: Route.ActionArgs) {
	const { id } = QuerySchema.parse(params)

	const result = await parseFormData(request, ActionSchema)

	if (result.error) {
		return validationError(result.error, result.submittedData)
	}

	const tags = Array.from(
		collect<MentionNode>('mention', result.data.text),
		(node) => node.attrs.id,
	).filter((tag) => tag !== null)

	// await dbServer.note.update({
	// 	where: { id },
	// 	data: {
	// 		...result.data,
	// 		tags: {
	// 			set: [],
	// 			connectOrCreate: tags.map((path) => ({
	// 				where: { path },
	// 				create: { path },
	// 			})),
	// 		},
	// 	},
	// })

	// await dbServer.tag.deleteMany({
	// 	where: {
	// 		NOT: {
	// 			notes: {
	// 				some: {
	// 					id: {
	// 						not: undefined,
	// 					},
	// 				},
	// 			},
	// 		},
	// 	},
	// })

	return { ok: true }
}

export default function Note() {
	const note = { text: {} }
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

	return <Editor onUpdate={onChange} content={note.text ?? undefined} autofocus={!note.text} />
}
