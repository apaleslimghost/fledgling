import {
	type Editor,
	type EditorProviderProps,
	Tiptap,
	useEditor,
} from '@tiptap/react'

import { forwardRef, type PropsWithChildren, useEffect, useImperativeHandle, useRef } from 'react'
import { extensions } from './editor/extensions'

export default forwardRef<Editor, Omit<EditorProviderProps, 'extensions'> & { id: string }>(
	(props, ref) => {
		const editor = useEditor({
			extensions,
			immediatelyRender: false,
			...props,
		})

		const contentRef = useRef(props.content)
		contentRef.current = props.content

		useEffect(() => {
			editor?.commands.setMeta('noteId', props.id)

			if (contentRef.current) {
				editor?.commands.setContent(contentRef.current, { emitUpdate: false })
			} else {
				editor?.commands.clearContent(false)
			}
		}, [props.id, editor])

		useImperativeHandle(ref, () => editor)

		if (!editor) return null

		return (
			<Tiptap editor={editor}>
				<Tiptap.Content />
			</Tiptap>
		)
	},
)
