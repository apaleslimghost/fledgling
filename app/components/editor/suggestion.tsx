import { type Editor, ReactRenderer } from '@tiptap/react'
import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion'
import { type ComponentProps, forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import { useWorkspace } from '~/data/context'

export type SuggestionListHandle = {
	onKeyDown: (event: KeyboardEvent) => boolean
}

type Suggestion = {
	id?: string
	label: string
}

type OnCreate = (suggestion: Suggestion, workspaceId: string) => Promise<{ id: string }>

const SuggestionList = forwardRef<
	SuggestionListHandle,
	SuggestionProps<Suggestion> & { char: string, onCreate: OnCreate }
>(({ items, command, char, onCreate }, ref) => {
	const [selectedIndex, setSelectedIndex] = useState(0)
	const workspaceId = useWorkspace()

	useEffect(() => {
		setSelectedIndex((index) => (index >= items.length ? 0 : index))
	}, [items.length])

	const selectMention = useCallback(async (suggestion?: Suggestion) => {
		if (!suggestion) return

		if (!suggestion.id) {
			const { id } = await onCreate(suggestion, workspaceId)
			suggestion.id = id
		}

		command(suggestion)
	}, [command])

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
				selectMention(items[selectedIndex])
				return true
			}

			if (event.key === 'Escape') {
				return true // tells Tiptap to close
			}

			return false
		},
	}))

	if (!items.length) return null

	return (
		<menu>
			{items.map((item, index) => (
				<li key={item.id ?? item.label} id={item.id} className={index === selectedIndex ? 'selected' : ''}>
					<a href='#' onClick={(event) => {
						event.preventDefault()
						selectMention(item)
					}}>
						{char}
						{item.label}
					</a>
				</li>
			))}
		</menu>
	)
})

export const makeSuggester = ({
	char,
	items,
	onCreate,
	allowSpaces = false,
}: Pick<SuggestionOptions<Suggestion>, 'char' | 'items' | 'allowSpaces'> & { onCreate: OnCreate }): Pick<
	SuggestionOptions<Suggestion>,
	'char' | 'items' | 'allowSpaces' | 'render'
> => ({
	char,
	items,
	allowSpaces,
	render() {
		let component: ReactRenderer
		let unmount: () => void

		return {
			onStart(props) {
				component = new ReactRenderer(SuggestionList, {
					props: {
						...props,
						char: char ?? '',
						onCreate
					},
					editor: props.editor,
				})
				unmount = props.mount(component.element)
			},

			onUpdate(props) {
				component.updateProps(props)
			},

			onKeyDown(props) {
				return (component.ref as SuggestionListHandle | undefined)?.onKeyDown(props.event) ?? false
			},

			onExit() {
				unmount()
				component.destroy()
			},
		}
	},
})
