import { Chip } from '@heroui/react'
import type { Node } from '@tiptap/pm/model'
import { type NodeType, NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react'
import { useMemo } from 'react'
import { type UseRxQueryOptions, useLiveRxQuery } from 'rxdb/plugins/react'
import { getNoteTitle } from '~/lib/note'
import type { Note } from '~/lib/rx-types'
import database from '~/lib/rxdb'
import Link from './link'

const NoteMentionView = (props: {
	node: Node
	ref?: React.RefObject<HTMLAnchorElement | null>
}) => {
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

export const MentionView = (props: {
	node: Node
	ref?: React.RefObject<HTMLAnchorElement | null>
}) => {
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
