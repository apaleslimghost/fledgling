import Document from '@tiptap/extension-document'
import { Mention } from '@tiptap/extension-mention'
import { Placeholder } from '@tiptap/extensions'
import {
	EditorProvider,
	type EditorProviderProps,
	mergeAttributes,
	Node,
	ReactRenderer,
} from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion'
import Minisearch from 'minisearch'
import tippy, { type GetReferenceClientRect, type Instance } from 'tippy.js'
import type { Tag } from '~/lib/rx-types'
import database from '~/lib/rxdb.client'
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

function TagSuggest({ items, command }: SuggestionProps<string>) {
	return (
		<ul>
			{items.map((item) => (
				<li key={item}>
					<Link
						to="#"
						onClick={(e) => {
							e.preventDefault()
							command({ id: item })
						}}
					>
						{item}
					</Link>
				</li>
			))}
		</ul>
	)
}

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
		let popup: Instance[]

		return {
			onStart(props) {
				component = new ReactRenderer(TagSuggest, { props, editor: props.editor })

				popup = tippy('body', {
					getReferenceClientRect: props.clientRect as GetReferenceClientRect,
					appendTo: () => document.body,
					content: component.element,
					showOnCreate: true,
					interactive: true,
					trigger: 'manual',
					placement: 'bottom-start',
				})
			},
			onUpdate(props) {
				component.updateProps(props)
				popup[0]!.setProps({
					getReferenceClientRect: props.clientRect as GetReferenceClientRect,
				})
			},
			onExit() {
				component.destroy()
				popup[0]!.destroy()
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
				class: 'rt-Heading rt-r-size-12',
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
			class: 'rt-reset rt-Badge rt-r-size-1 rt-variant-soft',
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

export default function Editor(props: Omit<EditorProviderProps, 'extensions'>) {
	return <EditorProvider immediatelyRender={false} {...props} extensions={extensions} />
}
