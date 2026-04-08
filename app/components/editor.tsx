import { Chip, cn, ListBox, Surface } from '@heroui/react'
import Document from '@tiptap/extension-document'
import { Mention } from '@tiptap/extension-mention'
import { Placeholder } from '@tiptap/extensions'
import {
	type Editor,
	EditorProvider,
	type EditorProviderProps,
	mergeAttributes,
	Node,
	ReactRenderer,
} from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion'
import Minisearch from 'minisearch'
import { type ComponentProps, forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import tippy, { type GetReferenceClientRect, type Instance } from 'tippy.js'
import type { Tag } from '~/lib/rx-types'
import database from '~/lib/rxdb'
import Link from './link'

const search = new Minisearch<Tag>({
	fields: ['path'],
	storeFields: ['path'],
	idField: 'path',
	tokenize: (text) => text.split('/'),
	searchOptions: {
		prefix: true,
		fuzzy: 0.2,
	},
})

database.tags.find().$.subscribe((results) => {
	search.removeAll()
	search.addAllAsync(results)
})

export type TagSuggestHandle = {
	onKeyDown: (event: KeyboardEvent) => boolean
}

const TagSuggest = forwardRef<TagSuggestHandle, SuggestionProps<string>>(
	({ items, command, clientRect }, ref) => {
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
					command({ id: items[selectedIndex] })
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
					selectedKeys={[items[selectedIndex]!]}
					onSelectionChange={(value) => {
						command({ id: Array.from(value)[0] })
					}}
				>
					{items.map((item, index) => (
						<ListBox.Item key={item} textValue={item} id={item}>
							<Chip color="accent" variant={selectedIndex === index ? 'soft' : 'tertiary'}>
								#{item}
							</Chip>
							<ListBox.ItemIndicator />
						</ListBox.Item>
					))}
				</ListBox>
			</Surface>
		)
	},
)

const suggestion: Omit<SuggestionOptions<string>, 'editor'> = {
	char: '#',
	async items({ query }) {
		const tags = search.search(query)

		return [
			...(query && !tags.some((t) => t.path === query) ? [query] : []),
			...tags.map((tag) => tag.path),
		]
	},
	render() {
		let component: ReactRenderer

		return {
			onStart(props) {
				component = new ReactRenderer(TagSuggest, {
					props: {
						...props,
						clientRect: props.clientRect,
					},
					editor: props.editor,
				} satisfies { props: ComponentProps<typeof TagSuggest>; editor: Editor })

				document.body.appendChild(component.element)
			},

			onUpdate(props) {
				component.updateProps({
					...props,
					clientRect: props.clientRect,
				})
			},

			onKeyDown(props) {
				return (component.ref as TagSuggestHandle | undefined)?.onKeyDown(props.event) ?? false
			},

			onExit() {
				component.destroy()
			},
		}
	},
}

const Title = Node.create({
	name: 'title',
	content: 'text*',
	renderHTML({ HTMLAttributes }) {
		return [
			'h1',
			mergeAttributes(HTMLAttributes, {
				class: 'text-4xl font-bold',
			}),
			0,
		]
	},
	parseHTML() {
		return [
			{
				tag: 'h1',
			},
		]
	},
})

export const extensions = [
	Title.configure(),
	Document.extend({
		content: 'title block*',
	}),
	StarterKit.configure({
		document: false,
		heading: {
			levels: [2, 3, 4, 5, 6],
		},
	}),
	Mention.configure({
		suggestion,
		HTMLAttributes: {
			class: 'chip chip--accent chip--soft',
		},
		renderHTML({ options, node }) {
			return [
				'a',
				mergeAttributes(options.HTMLAttributes, {
					href: `/tag/${node.attrs.id}`,
				}),
				`${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`,
			]
		},
	}),
	Placeholder.configure({
		placeholder: ({ node }) => {
			if (node.type.name === 'title') {
				return 'Untitled note'
			}
			return ''
		},
	}),
]

export default function EditorComponent(props: Omit<EditorProviderProps, 'extensions'>) {
	return (
		<EditorProvider autofocus="end" immediatelyRender={false} {...props} extensions={extensions} />
	)
}
