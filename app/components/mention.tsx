import type { Node } from '@tiptap/pm/model'
import { NodeViewWrapper } from '@tiptap/react'
import { useMemo } from 'react'
import { Link } from 'react-router'
import { useRxQuery } from 'rxdb/plugins/react'
import { useWorkspace } from '~/data/context'
import database from '~/data/rxdb.client'

const TagMention = (props: {
	node: Node
	ref?: React.RefObject<HTMLAnchorElement | null>
}) => {
	const tagQuery = useMemo(
		() => ({
			selector: { id: props.node.attrs.id }
		}), [props.node.attrs.id]
	)

	const { results: [tag] } = useRxQuery({
		collection: database.tags,
		query: tagQuery
	})

	const workspaceId = useWorkspace()

	return (
		<NodeViewWrapper as="span">
			<Link ref={props.ref} to={`/workspace/${workspaceId}/tag/${tag?.path ?? props.node.attrs.id}`} className="label">
				{props.node.attrs.mentionSuggestionChar}{tag?.path ?? props.node.attrs.label}
			</Link>
		</NodeViewWrapper>
	)
}

const ProjectMention = (props: {
	node: Node
	ref?: React.RefObject<HTMLAnchorElement | null>
}) => {
	const projectQuery = useMemo(
		() => ({
			selector: { id: props.node.attrs.id }
		}), [props.node.attrs.id]
	)

	const { results: [project] } = useRxQuery({
		collection: database.projects,
		query: projectQuery
	})

	const workspaceId = useWorkspace()

	return (
		<NodeViewWrapper as="span">
			<Link ref={props.ref} to={`/workspace/${workspaceId}/project/${project?.id ?? props.node.attrs.id}`} className="label secondary">
				{props.node.attrs.mentionSuggestionChar}{project?.title ?? props.node.attrs.label}
			</Link>
		</NodeViewWrapper>
	)
}

export const MentionView = (props: {
	node: Node
	ref?: React.RefObject<HTMLAnchorElement | null>
}) => {
	if (props.node.attrs.mentionSuggestionChar === '#') {
		return <TagMention {...props} />
	}

	return <ProjectMention {...props} />
}
