import Document from '@tiptap/extension-document'
import { Mention } from '@tiptap/extension-mention'
import { Placeholder } from '@tiptap/extensions'
import { mergeAttributes, Node, ReactNodeViewRenderer } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import Minisearch from 'minisearch'
import { getNoteTitle } from '~/lib/note'
import type { Tag } from '~/lib/rx-types'
import database from '~/lib/rxdb'
import { MentionView } from '../mention'
import { makeSuggester } from '../suggestion'

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
			const title = getNoteTitle(note)
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
				class: 'text-2xl font-bold',
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
	Mention.extend({
		addNodeView() {
			return ReactNodeViewRenderer(MentionView)
		},
	}).configure({
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
