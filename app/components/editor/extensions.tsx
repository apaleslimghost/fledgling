import { Mention } from '@tiptap/extension-mention'
import { Placeholder } from '@tiptap/extensions'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import Minisearch from 'minisearch'
import type { Tag } from '~/lib/rx-types'
import database from '~/lib/rxdb'
import { MentionView } from '../mention'
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
	Placeholder.configure({
		placeholder: ({ node }) => {
			if (node.type.name === 'title') {
				return 'Untitled note'
			}
			return ''
		},
	}),
]
