import { Mention } from '@tiptap/extension-mention'
import { Node, ReactNodeViewRenderer } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import Minisearch from 'minisearch'
import type { Tag } from '~/lib/rx-types'
import database from '~/lib/rxdb'
import { MentionView } from '../mention'
import SearchView from '../search-view'
import { makeSuggester } from '../suggestion'

const tagSearch = new Minisearch<Tag>({
	fields: ['path'],
	storeFields: ['path', 'id'],
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
			if (!note.title) return []
			return [{ id: note.id, title: note.title }]
		}),
	)
})

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		search: {
			insertSearch: () => ReturnType
		}
	}
}

const SearchViewNode = Node.create({
	name: 'search',
	group: 'block',
	atom: true,
	selectable: false,
	draggable: true,
	isolating: true,
	parseHTML() {
		return [{ tag: 'div[data-type="search"]' }]
	},
	renderHTML({ HTMLAttributes }) {
		return ['div', { 'data-type': 'search', ...HTMLAttributes }]
	},
	addNodeView() {
		return ReactNodeViewRenderer(SearchView, {
			stopEvent: () => {
				return true
			},
		})
	},
	addCommands() {
		return {
			insertSearch:
				() =>
				({ commands }) => {
					return commands.insertContent({ type: 'search' })
				},
		}
	},
	addAttributes() {
		return {
			query: {
				default: null,
			},
			confirmed: {
				default: false,
			},
		}
	},
})

export const extensions = [
	StarterKit.configure({
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
						...(query && !tags.some((t) => t.path === query)
							? [{ id: crypto.randomUUID(), label: query }]
							: []),
						...tags.map((tag) => ({
							id: tag.id,
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
	SearchViewNode,
]
