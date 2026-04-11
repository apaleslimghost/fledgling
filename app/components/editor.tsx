import Document from '@tiptap/extension-document'
import { Mention } from '@tiptap/extension-mention'
import { Placeholder } from '@tiptap/extensions'
import {
	type EditorProviderProps,
	generateText,
	mergeAttributes,
	Node,
	Tiptap,
	useEditor,
} from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import Minisearch from 'minisearch'
import { useEffect } from 'react'
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

type NoteSuggestion = {
	id: string
	title: string
}

const noteSearch = new Minisearch<NoteSuggestion>({
	fields: ['title'],
	storeFields: ['id', 'title'],
	idField: 'id',
	searchOptions: {
		fuzzy: 0.2,
	},
})

database.notes.find().$.subscribe((results) => {
	noteSearch.removeAll()
	noteSearch.addAllAsync(
		results.flatMap((note) => {
			const title = note.text?.content
				?.find((node) => node.type === 'title')
				?.content?.map((c) => c.text ?? '')
				.join('')
			if (!title) return []
			return [{ id: note.id, title }]
		}),
	)
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
		suggestions: [
			makeSuggester({
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
			}),
			makeSuggester({
				char: '@',
				async items({ query }) {
					return noteSearch.search(query).map((result) => ({
						id: result.id,
						label: result.title,
					}))
				},
			}),
		],
		renderHTML({ options, node }) {
			return [
				'a',
				mergeAttributes(options.HTMLAttributes, {
					class: `chip chip--accent ${node.attrs.mentionSuggestionChar === '#' ? 'chip--soft' : 'chip--secondary'}`,
					href: `/${node.attrs.mentionSuggestionChar === '#' ? 'tag' : 'note'}/${node.attrs.id}`,
				}),
				`${node.attrs.mentionSuggestionChar}${node.attrs.label ?? node.attrs.id}`,
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
