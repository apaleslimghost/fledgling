import { ListKit } from '@tiptap/extension-list'
import { Mention } from '@tiptap/extension-mention'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { MentionView } from '../mention'
import { makeSuggester } from './suggestion'
import { tagSearch } from '~/data/search'

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
			}),
		],
	}),
]
