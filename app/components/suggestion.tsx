import { Chip, ListBox, Surface } from '@heroui/react'
import { type Editor, ReactRenderer } from '@tiptap/react'
import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion'
import { type ComponentProps, forwardRef, useEffect, useImperativeHandle, useState } from 'react'

export type SuggestionListHandle = {
	onKeyDown: (event: KeyboardEvent) => boolean
}

type Suggestion = {
	id: string
	label: string
}

const SuggestionList = forwardRef<
	SuggestionListHandle,
	SuggestionProps<Suggestion> & { char: string }
>(({ items, command, clientRect, char }, ref) => {
	const [selectedIndex, setSelectedIndex] = useState(0)

	useEffect(() => {
		setSelectedIndex((index) => (index >= items.length ? 0 : index))
	}, [items.length])

	useImperativeHandle(ref, () => ({
		onKeyDown: (event: KeyboardEvent) => {
			if (event.key === 'ArrowDown') {
				setSelectedIndex((i) => (i + 1) % items.length)
				return true
			}

			if (event.key === 'ArrowUp') {
				setSelectedIndex((i) => (i - 1 + items.length) % items.length)
				return true
			}

			if (event.key === 'Enter') {
				command({ id: items[selectedIndex]!.id })
				return true
			}

			if (event.key === 'Escape') {
				return true // tells Tiptap to close
			}

			return false
		},
	}))

	if (!clientRect) return null

	const rect = clientRect()
	if (!rect) return null

	if (!items.length) return null

	return (
		<Surface
			style={{
				top: rect.bottom + 4,
				left: rect.left,
			}}
			className="fixed z-10 border shadow-lg rounded-lg min-w-[200px]"
		>
			<ListBox
				selectionMode="single"
				selectedKeys={[items[selectedIndex]!.id]}
				onSelectionChange={(value) => {
					command({ id: Array.from(value)[0] })
				}}
			>
				{items.map((item, index) => (
					<ListBox.Item key={item.id} textValue={item.label} id={item.id}>
						<Chip color="accent" variant={selectedIndex === index ? 'soft' : 'tertiary'}>
							{char}
							{item.label}
						</Chip>
						<ListBox.ItemIndicator />
					</ListBox.Item>
				))}
			</ListBox>
		</Surface>
	)
})

export const makeSuggester = ({
	char,
	items,
}: Pick<SuggestionOptions<Suggestion>, 'char' | 'items'>): Pick<
	SuggestionOptions<Suggestion>,
	'char' | 'items' | 'render'
> => ({
	char,
	items,
	render() {
		let component: ReactRenderer

		return {
			onStart(props) {
				component = new ReactRenderer(SuggestionList, {
					props: {
						...props,
						clientRect: props.clientRect,
						char: char ?? '',
					},
					editor: props.editor,
				} satisfies { props: ComponentProps<typeof SuggestionList>; editor: Editor })

				document.body.appendChild(component.element)
			},

			onUpdate(props) {
				component.updateProps({
					...props,
					clientRect: props.clientRect,
				})
			},

			onKeyDown(props) {
				return (component.ref as SuggestionListHandle | undefined)?.onKeyDown(props.event) ?? false
			},

			onExit() {
				component.destroy()
			},
		}
	},
})
