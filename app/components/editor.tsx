import {
	At,
	Bold,
	Code,
	Hashtag,
	Heading,
	Heading2,
	Heading3,
	Heading4,
	Italic,
	ListOl,
	ListUl,
	Minus,
	Underline,
} from '@gravity-ui/icons'
import {
	Button,
	ButtonGroup,
	Separator,
	ToggleButton,
	ToggleButtonGroup,
	Toolbar,
} from '@heroui/react'
import {
	type Editor,
	type EditorProviderProps,
	Tiptap,
	useEditor,
	useEditorState,
} from '@tiptap/react'
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
import { type PropsWithChildren, useEffect } from 'react'
import { extensions } from './editor/extensions'

const MarkToggleButton = ({
	mark,
	editor,
	label,
	children,
}: PropsWithChildren<{ mark: string; editor: Editor; label: string }>) => {
	const isActive = useEditorState({
		editor,
		selector: ({ editor }) => editor.isActive(mark),
	})

	return (
		<ToggleButton
			isIconOnly
			isSelected={isActive}
			aria-label={label}
			onChange={(value) => {
				if (value) {
					editor.chain().focus().setMark(mark).run()
				} else {
					editor.chain().focus().unsetMark(mark).run()
				}
			}}
		>
			{children}
		</ToggleButton>
	)
}

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
			<FloatingMenu editor={editor}>
				<Toolbar aria-label="Insert">
					<ButtonGroup size="sm">
						<Button
							isIconOnly
							variant="tertiary"
							aria-label="Reference"
							onClick={() => editor.chain().focus().insertContent('@').run()}
						>
							<At />
						</Button>
						<Button
							isIconOnly
							variant="tertiary"
							aria-label="Tag"
							onClick={() => editor.chain().focus().insertContent('#').run()}
						>
							<Hashtag />
						</Button>
					</ButtonGroup>
					<Separator />
					<ButtonGroup size="sm">
						<Button
							isIconOnly
							variant="tertiary"
							aria-label="Heading"
							onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
						>
							<Heading2 />
						</Button>
						<Button
							isIconOnly
							variant="tertiary"
							aria-label="Heading"
							onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
						>
							<Heading3 />
						</Button>
						<Button
							isIconOnly
							variant="tertiary"
							aria-label="Heading"
							onClick={() => editor.chain().focus().setHeading({ level: 4 }).run()}
						>
							<Heading4 />
						</Button>
						<Button
							isIconOnly
							variant="tertiary"
							aria-label="Ordered list"
							onClick={() => editor.chain().focus().toggleOrderedList().run()}
						>
							<ListOl />
						</Button>
						<Button
							isIconOnly
							variant="tertiary"
							aria-label="Unordered list"
							onClick={() => editor.chain().focus().toggleBulletList().run()}
						>
							<ListUl />
						</Button>
						<Button
							isIconOnly
							variant="tertiary"
							aria-label="Horizontal rule"
							onClick={() => editor.chain().focus().setHorizontalRule().run()}
						>
							<Minus />
						</Button>
					</ButtonGroup>
				</Toolbar>
			</FloatingMenu>

			<BubbleMenu>
				<Toolbar isAttached aria-label="Text formatting">
					<ToggleButtonGroup size="sm" aria-label="Text style" selectionMode="multiple">
						<MarkToggleButton editor={editor} mark="bold" label="Bold">
							<Bold />
						</MarkToggleButton>
						<MarkToggleButton editor={editor} mark="italic" label="Italic">
							<Italic />
						</MarkToggleButton>
						<MarkToggleButton editor={editor} mark="underline" label="Underline">
							<Underline />
						</MarkToggleButton>
						<MarkToggleButton editor={editor} mark="code" label="Code">
							<Code />
						</MarkToggleButton>
					</ToggleButtonGroup>
				</Toolbar>
			</BubbleMenu>
		</Tiptap>
	)
}
