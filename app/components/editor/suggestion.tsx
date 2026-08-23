import { type Editor, ReactRenderer } from '@tiptap/react'
import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion'
import { useDb } from 'jazz-tools/react'
import { type ComponentProps, forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import { app } from '../../../schema'
import type { Db } from 'jazz-tools'

export type SuggestionListHandle = {
	onKeyDown: (event: KeyboardEvent) => boolean
}

type Suggestion = {
	id?: string
	label: string
}

type OnCreate = (db: Db, suggestion: Suggestion) => Promise<{ id: string }>

const SuggestionList = forwardRef<
	SuggestionListHandle,
	SuggestionProps<Suggestion> & { char: string, onCreate: OnCreate }
>(({ items, command, char, onCreate }, ref) => {
	const [selectedIndex, setSelectedIndex] = useState(0)
	const db = useDb()

	useEffect(() => {
		setSelectedIndex((index) => (index >= items.length ? 0 : index))
	}, [items.length])

	const selectMention = useCallback(async (suggestion?: Suggestion) => {
		if (!suggestion) return

		if (!suggestion.id) {
			const { id } = await onCreate(db, suggestion)
			suggestion.id = id
		}

		command(suggestion)
	}, [db, command])

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
		<ul className="selection-menu surface mid">
			{items.map((item, index) => (
				<li key={item.id} id={item.id} className={index === selectedIndex ? 'selected' : ''}>
					<a href='#' onClick={(event) => {
						event.preventDefault()
						selectMention(item)
					}} className='label'>
						{char}
						{item.label}
					</a>
				</li>
			))}
		</ul>
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
