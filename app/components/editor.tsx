import { Chip } from '@heroui/react'
import Document from '@tiptap/extension-document'
import { Mention } from '@tiptap/extension-mention'
import { Placeholder } from '@tiptap/extensions'
import {
	type EditorProviderProps,
	generateText,
	mergeAttributes,
	Node,
	NodeViewRendererProps,
	NodeViewWrapper,
	type ReactNodeViewProps,
	ReactNodeViewRenderer,
	Tiptap,
	useEditor,
} from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import Minisearch from 'minisearch'
import { useEffect, useMemo } from 'react'
import {
	type UseRxQueryOptions,
	useLiveRxQuery,
	useRxDatabase,
	useRxQuery,
} from 'rxdb/plugins/react'
import type { Note, Tag } from '~/lib/rx-types'
import database from '~/lib/rxdb'
import Link from './link'
import { makeSuggester } from './suggestion'

const tagSearch = new Minisearch<Tag>({
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
	tagSearch.removeAll()
	tagSearch.addAllAsync(results)
})

type NoteSuggestion = {
	id: string
	title: string
}

const noteSearch = new Minisearch<NoteSuggestion>({
	fields: ['title'],
	storeFields: ['id', 'title'],
	idField: 'id',
	searchOptions: {
		fuzzy: 0.2,
	},
})

const getNoteTitle = (note?: Note) =>
	note?.text?.content
		?.find((node) => node.type === 'title')
		?.content?.map((c) => c.text ?? '')
		.join('')

database.notes.find().$.subscribe((results) => {
	noteSearch.removeAll()
	noteSearch.addAllAsync(
		results.flatMap((note) => {
			const title = getNoteTitle(note)
			if (!title) return []
			return [{ id: note.id, title }]
		}),
	)
})

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

const NoteMentionView = (props: ReactNodeViewProps<HTMLAnchorElement>) => {
	const mentionQuery: UseRxQueryOptions<Note> = useMemo(
		() => ({
			collection: database.notes,
			query: {
				selector: {
					id: props.node.attrs.id,
				},
			},
		}),
		[props.node.attrs.id],
	)

	const {
		results: [note],
	} = useLiveRxQuery(mentionQuery)

	const title = getNoteTitle(note)

	return (
		<MentionChip
			href={`/note/${props.node.attrs.id}`}
			char={props.node.attrs.mentionSuggestionChar}
			label={title ?? props.node.attrs.label}
			//@ts-expect-error what do you want me to do about this tiptap
			ref={props.ref}
			variant="secondary"
		/>
	)
}

const MentionChip = ({
	href,
	char,
	label,
	variant,
	ref,
}: {
	href: string
	char: string
	label: string
	variant?: 'primary' | 'secondary'
	ref?: React.RefObject<HTMLAnchorElement>
}) => {
	return (
		<NodeViewWrapper as="span">
			<Link ref={ref} to={href}>
				<Chip variant={variant} color="accent">
					{char}
					{label}
				</Chip>
			</Link>
		</NodeViewWrapper>
	)
}

const MentionView = (props: ReactNodeViewProps<HTMLAnchorElement>) => {
	return props.node.attrs.mentionSuggestionChar === '#' ? (
		<MentionChip
			href={`/tag/${props.node.attrs.id}`}
			char={props.node.attrs.mentionSuggestionChar}
			label={props.node.attrs.id}
			//@ts-expect-error what do you want me to do about this tiptap
			ref={props.ref}
			variant="primary"
		/>
	) : (
		<NoteMentionView {...props} />
	)
}

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
	Mention.extend({
		addNodeView() {
			return ReactNodeViewRenderer(MentionView)
		},
	}).configure({
		suggestions: [
			makeSuggester({
				char: '#',
				async items({ query }) {
					const tags = tagSearch.search(query)

					return [
						...(query && !tags.some((t) => t.path === query) ? [{ id: query, label: query }] : []),
						...tags.map((tag) => ({
							id: tag.path,
							label: tag.path,
						})),
					]
				},
			}),
			makeSuggester({
				char: '@',
				async items({ query }) {
					return noteSearch.search(query).map((result) => ({
						id: result.id,
						label: result.title,
					}))
				},
			}),
		],
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
		</Tiptap>
	)
}
