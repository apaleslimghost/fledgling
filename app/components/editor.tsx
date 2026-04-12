import { type EditorProviderProps, Tiptap, useEditor } from '@tiptap/react'
import { useEffect } from 'react'
import { extensions } from './editor/extensions'

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
