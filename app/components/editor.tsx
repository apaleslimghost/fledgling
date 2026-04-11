import Document from '@tiptap/extension-document'
import { Mention } from '@tiptap/extension-mention'
import { Placeholder } from '@tiptap/extensions'
import {
	type Editor,
	type EditorProviderProps,
	mergeAttributes,
	Node,
	ReactRenderer,
	Tiptap,
	useEditor,
} from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import type { SuggestionOptions } from '@tiptap/suggestion'
import Minisearch from 'minisearch'
import { type ComponentProps, useEffect } from 'react'
import type { Tag } from '~/lib/rx-types'
import database from '~/lib/rxdb'
import { makeSuggester } from './suggestion'

const tagSearch = new Minisearch<Tag>({
	fields: ['path'],
	storeFields: ['path'],
	idField: 'path',
	tokenize: (text) => text.split('/'),
	searchOptions: {
		prefix: true,
		fuzzy: 0.2,
	},
})

database.tags.find().$.subscribe((results) => {
	tagSearch.removeAll()
	tagSearch.addAllAsync(results)
})

const tagSuggestion = makeSuggester({
	char: '#',
	async items({ query }) {
		const tags = tagSearch.search(query)

		return [
			...(query && !tags.some((t) => t.path === query) ? [{ id: query, label: query }] : []),
			...tags.map((tag) => ({
				id: tag.path,
				label: tag.path,
			})),
		]
	},
})

const Title = Node.create({
	name: 'title',
	content: 'text*',
	renderHTML({ HTMLAttributes }) {
		return [
			'h1',
			mergeAttributes(HTMLAttributes, {
				class: 'text-4xl font-bold',
			}),
			0,
		]
	},
	parseHTML() {
		return [
			{
				tag: 'h1',
			},
		]
	},
})

export const extensions = [
	Title.configure(),
	Document.extend({
		content: 'title block*',
	}),
	StarterKit.configure({
		document: false,
		heading: {
			levels: [2, 3, 4, 5, 6],
		},
	}),
	Mention.configure({
		suggestion: tagSuggestion,
		HTMLAttributes: {
			class: 'chip chip--accent chip--soft',
		},
		renderHTML({ options, node }) {
			return [
				'a',
				mergeAttributes(options.HTMLAttributes, {
					href: `/tag/${node.attrs.id}`,
				}),
				`${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`,
			]
		},
	}),
	Placeholder.configure({
		placeholder: ({ node }) => {
			if (node.type.name === 'title') {
				return 'Untitled note'
			}
			return ''
		},
	}),
]

export default function EditorComponent(
	props: Omit<EditorProviderProps, 'extensions'> & { id: string },
) {
	const editor = useEditor({
		extensions,
		immediatelyRender: false,
		...props,
	})

	useEffect(() => {
		editor?.commands.setMeta('noteId', props.id)

		if (props.content) {
			editor?.commands.setContent(props.content, { emitUpdate: false })
		} else {
			editor?.commands.clearContent(false)
		}
	}, [props.id, editor, props.content])

	if (!editor) return null

	return (
		<Tiptap editor={editor}>
			<Tiptap.Content />
		</Tiptap>
	)
}
