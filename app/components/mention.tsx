import { Chip } from '@heroui/react'
import type { Node } from '@tiptap/pm/model'
import { type NodeType, NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react'
import { useMemo } from 'react'
import { type UseRxQueryOptions, useLiveRxQuery } from 'rxdb/plugins/react'
import type { Note, Tag } from '~/lib/rx-types'
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

	return (
		<MentionChip
			href={`/note/${props.node.attrs.id}`}
			char={props.node.attrs.mentionSuggestionChar}
			label={note?.title ?? props.node.attrs.label}
			//@ts-expect-error what do you want me to do about this tiptap
			ref={props.ref}
			variant="secondary"
		/>
	)
}

const TagMentionView = (props: { node: Node; ref?: React.RefObject<HTMLAnchorElement | null> }) => {
	const mentionQuery: UseRxQueryOptions<Tag> = useMemo(
		() => ({
			collection: database.tags,
			query: {
				selector: {
					id: props.node.attrs.id,
				},
			},
		}),
		[props.node.attrs.id],
	)

	const {
		results: [tag],
	} = useLiveRxQuery(mentionQuery)

	return (
		<MentionChip
			href={`/tag/${tag?.path ?? props.node.attrs.id}`}
			char="#"
			label={tag?.path ?? props.node.attrs.label}
			//@ts-expect-error what do you want me to do about this tiptap
			ref={props.ref}
			variant="primary"
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
		<TagMentionView {...props} />
	) : (
		<NoteMentionView {...props} />
	)
}
