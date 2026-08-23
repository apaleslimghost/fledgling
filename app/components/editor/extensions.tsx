import { ListKit } from '@tiptap/extension-list'
import { Mention } from '@tiptap/extension-mention'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { MentionView } from '../mention'
import { makeSuggester } from './suggestion'
import { projectSearch, tagSearch } from '~/data/search'
import { app } from '../../../schema'

export const extensions = [
	StarterKit.configure({
		heading: {
			levels: [2, 3, 4, 5, 6],
		},
	}),
	ListKit.configure({
		taskItem: {
			nested: true,
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
							? [{ label: query }]
							: []),
						...tags.map((tag) => ({
							id: tag.id,
							label: tag.path,
						})),
					]
				},
				onCreate: async (db, tag) => {
					const inserted = await db.insert(app.tags, {
						path: tag.label
					}).wait({ tier: 'local' })

					return { id: inserted.id }
				},
			}),
			makeSuggester({
				char: '@',
				allowSpaces: true,
				async items({ query }) {
					const projects = projectSearch.search(query)

					return [
						...(query && !projects.some((t) => t.title === query)
							? [{ label: query }]
							: []),
						...projects.map((project) => ({
							id: project.id,
							label: project.title,
						})),
					]
				},
				onCreate: async (db, project) => {
					const inserted = await db.insert(app.projects, {
						title: project.label,
						tagIds: [],
					}).wait({ tier: 'local' })

					return { id: inserted.id }
				},
			}),
		],
	}),
]
