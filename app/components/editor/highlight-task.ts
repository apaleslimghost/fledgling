import { Decoration, Extension } from '@tiptap/core'

interface HighlightStorage {
	taskId: string | undefined
}

declare module '@tiptap/core' {
	interface Storage {
		highlight: HighlightStorage
	}
	interface Commands<ReturnType> {
		highlight: {
			setTaskId: (taskId: string | undefined) => ReturnType
		}
	}
}

export const Highlight = Extension.create<{}, HighlightStorage>({
	name: 'highlight',

	addStorage() {
		return { taskId: undefined }
	},

	addCommands() {
		return {
			setTaskId: (taskId: string | undefined) => ({ editor, commands }) => {
				editor.storage.highlight.taskId = taskId
				commands.updateDecorations('highlight')
				return true
			},
		}
	},

	addDecorations() {
		return {
			update: 'manual',
			create: ({ editor, state }) => {
				const taskId = editor.storage.highlight.taskId
				if (!taskId) return []

				const decorations: Decoration[] = []

				state.doc.descendants((node, pos) => {
					if (node.type.name === 'taskItem' && node.attrs.id === taskId) {
						decorations.push(
							Decoration.Node(pos, pos + node.nodeSize, { class: 'highlight-match' }),
						)
					}
				})

				return decorations
			},
		}
	},
})
