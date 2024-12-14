import { Tag } from "@prisma/client";
import {Link as LinkExtension} from "@tiptap/extension-link";
import { Mention } from "@tiptap/extension-mention";
import { EditorProvider, EditorProviderProps, Node, ReactRenderer } from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";
import { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";
import tippy, { GetReferenceClientRect, Instance } from 'tippy.js'
import Link from "./link";
import Document from "@tiptap/extension-document";

function TagSuggest({items, command}: SuggestionProps<string>) {
	return <ul>
		{items.map(
			item => <li key={item}><Link to='#' onClick={(e) => {
				e.preventDefault()
				command({ id: item })
			}}>{item}</Link></li>
		)}
	</ul>
}

const suggestion: Omit<SuggestionOptions<string>, 'editor'> = {
	char: '#',
	async items({ query }) {
		const url = new URL('/tags/search', location.href)
		url.searchParams.set('q', query)
		const res = await fetch(url)
		const { tags } = await res.json()

		return [
			...(query ? [query] : []),
			...tags.map(
				(tag: Tag) => tag.path
			)
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
				popup[0].setProps({
					getReferenceClientRect: props.clientRect as GetReferenceClientRect,
				})
			},
			onExit() {
				component.destroy()
				popup[0].destroy()
			},
		}
	}
}

const Title = Node.create({
	name: 'title',
	content: 'text*',
	renderHTML({ HTMLAttributes }) {
		return ['h1', HTMLAttributes, 0]
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
	Title,
	Document.extend({
		content: 'title block*'
	}),
	StarterKit.configure({
		document: false,
		heading: {
			levels: [2, 3, 4, 5, 6]
		}
	}),
	Mention.configure({
		suggestion,
	}),
	LinkExtension
]

export default function Editor(props: Omit<EditorProviderProps, 'extensions'>) {
	return <EditorProvider immediatelyRender={false} {...props} extensions={extensions} />
}
