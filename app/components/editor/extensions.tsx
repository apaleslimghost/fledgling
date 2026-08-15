import { ListKit } from '@tiptap/extension-list'
import { StarterKit } from '@tiptap/starter-kit'

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
]
