import { ListKit, TaskItem } from '@tiptap/extension-list'
import { Mention } from '@tiptap/extension-mention'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { MentionView } from '../mention'
import { makeSuggester } from './suggestion'
import { projectSearch, tagSearch } from '~/data/search'

import { Extension, InputRule, Node } from '@tiptap/core'
import { findParentNodeClosestToPos } from '@tiptap/core'
import { cuid } from '~/data/cuid'
import { mutators } from '~/zero/mutators'

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

export const extensions = [
	StarterKit.configure({
		heading: {
			levels: [2, 3, 4, 5, 6],
		},
	}),
	ListKit.configure({
		taskItem: {
			nested: true,
		}
	}),
	Extension.create({
		addGlobalAttributes() {
			return [{
				types: ['taskItem'],
				attributes: {
					id: {
						default: null
					}
				}
			}]
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
				onCreate: async (zero, tag) => {
					const id = cuid()
					await zero.mutate(mutators.tag.create({
						id,
						path: tag.label
					})).client

					return { id }
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
				onCreate: async (zero, project) => {
					const id = cuid()
					await zero.mutate(mutators.project.create({
						id,
						title: project.label,
					})).client

					return { id }
				},
			}),
		],
	}),
	Extension.create({
		name: 'taskListInputRule',
		addInputRules: () => [taskListInputRule()]
	})
]
