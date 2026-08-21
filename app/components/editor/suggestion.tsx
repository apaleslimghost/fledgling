import { type Editor, ReactRenderer } from '@tiptap/react'
import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion'
import { useDb } from 'jazz-tools/react'
import { type ComponentProps, forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import { app } from '../../../schema'

export type SuggestionListHandle = {
	onKeyDown: (event: KeyboardEvent) => boolean
}

type Suggestion = {
	id?: string
	label: string
}

const SuggestionList = forwardRef<
	SuggestionListHandle,
	SuggestionProps<Suggestion> & { char: string }
>(({ items, command, char }, ref) => {
	const [selectedIndex, setSelectedIndex] = useState(0)
	const db = useDb()

	useEffect(() => {
		setSelectedIndex((index) => (index >= items.length ? 0 : index))
	}, [items.length])

	const selectTag = useCallback(async (tag?: Suggestion) => {
		if (!tag) return

		if (!tag.id) {
			const inserted = await db.insert(app.tags, {
				path: tag.label
			}).wait({ tier: 'local' })

			tag.id = inserted.id
		}

		command(tag)
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
				selectTag(items[selectedIndex])
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
		<ul className="selection-menu">
			{items.map((item, index) => (
				<li key={item.id} id={item.id} className={index === selectedIndex ? 'selected' : ''}>
					<a href='#' onClick={(event) => {
						event.preventDefault()
						selectTag(item)
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
}: Pick<SuggestionOptions<Suggestion>, 'char' | 'items'>): Pick<
	SuggestionOptions<Suggestion>,
	'char' | 'items' | 'render'
> => ({
	char,
	items,
	render() {
		let component: ReactRenderer
		let unmount: () => void

		return {
			onStart(props) {
				component = new ReactRenderer(SuggestionList, {
					props: {
						...props,
						char: char ?? '',
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
