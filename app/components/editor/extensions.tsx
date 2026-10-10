import { ListKit, TaskItem } from '@tiptap/extension-list'
import { Mention } from '@tiptap/extension-mention'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Document } from '@tiptap/extension-document'
import { Extension, InputRule, Node, findParentNodeClosestToPos } from '@tiptap/core'
import UniqueID from '@tiptap/extension-unique-id'

import { MentionView } from '../mention'
import { makeSuggester } from './suggestion'
import { noteSearch, projectSearch, tagSearch } from '~/data/search'
import { shortId } from '~/data/cuid'
import database from '~/data/rxdb.client'
import { Highlight } from './highlight-task'
import MiniSearch from 'minisearch'

const taskListInputRule = () => new InputRule({
	find: /^\[ ?\]$/,
	handler: ({ state, range, chain }) => {
		const listItem = findParentNodeClosestToPos(
			state.selection.$from,
			node => node.type.name === 'listItem',
		)

		if (!listItem) {
			return null
		}

		const list = state.doc.nodeAt(listItem.pos - 1)

		if (!list || list.type.name !== 'bulletList') {
			return null
		}

		chain()
			.deleteRange({
				from: range.from,
				to: range.to,
			})
			.toggleTaskList()
			.run()

	},
})

const Title = Node.create({
	name: 'title',
	content: 'text*',

	parseHTML() {
		return [
			{
				tag: 'h1',
			},
		]
	},

	renderHTML({ HTMLAttributes }) {
		return ['h1', HTMLAttributes, 0]
	},

})

export const extensions = [
	StarterKit.configure({
		heading: {
			levels: [2, 3, 4, 5, 6],
		},
		document: false,
		link: {
			openOnClick: false,
			enableClickSelection: true
		}
	}),
	Document.extend({
		content: 'title block*'
	}),
	Title.configure(),
	ListKit.configure({
		taskItem: {
			nested: true,
		}
	}),
	UniqueID.configure({
		types: ['taskItem'],
		generateID: shortId
	}),
	Highlight,
	Mention.extend({
		addNodeView() {
			return ReactNodeViewRenderer(MentionView)
		},
	}).configure({
		suggestions: [
			makeSuggester({
				char: '#',
				async items({ query }) {
					const tags = tagSearch.search(query || MiniSearch.wildcard)

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
				onCreate: async (tag, workspaceId) => {
					const id = shortId()
					await database.tags.insert({
						id,
						path: tag.label,
						workspace: workspaceId,
					})

					return { id }
				},
			}),
			makeSuggester({
				char: '@',
				allowSpaces: true,
				async items({ query }) {
					const projects = projectSearch.search(query || MiniSearch.wildcard)

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
				onCreate: async (project, workspaceId) => {
					const id = shortId()
					await database.projects.insert({
						id,
						title: project.label,
						workspace: workspaceId,
					})

					return { id }
				},
			}),
			makeSuggester({
				char: '~',
				allowSpaces: true,
				async items({ query }) {
					const notes = noteSearch.search(query || MiniSearch.wildcard)

					return [
						...notes.map((note) => ({
							id: note.id,
							label: note.title,
						})),
					]
				}
			}),
		],
	}),
	Extension.create({
		name: 'taskListInputRule',
		addInputRules: () => [taskListInputRule()]
	})
]
