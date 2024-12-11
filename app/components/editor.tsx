import { Tag } from "@prisma/client";
import {Link as LinkExtension} from "@tiptap/extension-link";
import { Mention } from "@tiptap/extension-mention";
import { EditorProvider, EditorProviderProps, NodeViewWrapper, ReactNodeViewRenderer, ReactRenderer } from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";
import { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";
import tippy, { GetReferenceClientRect, Instance } from 'tippy.js'
import Link from "./link";

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

export const extensions = [
	StarterKit,
	Mention.configure({
		suggestion,
	}),
	LinkExtension
]

export default function Editor(props: Omit<EditorProviderProps, 'extensions'>) {
	return <EditorProvider immediatelyRender={false} {...props} extensions={extensions} />
}
