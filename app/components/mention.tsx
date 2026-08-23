import type { Node } from '@tiptap/pm/model'
import { NodeViewWrapper } from '@tiptap/react'
import { useAll } from 'jazz-tools/react'
import { Link } from 'react-router'
import { app } from '../../schema'


const TagMention = (props: {
	node: Node
	ref?: React.RefObject<HTMLAnchorElement | null>
}) => {
	const [tag] = useAll(app.tags.where({ id: props.node.attrs.id })) ?? []

	return (
		<NodeViewWrapper as="span">
			<Link ref={props.ref} to={`/tag/${tag?.id ?? props.node.attrs.id}`} className="label">
				{props.node.attrs.mentionSuggestionChar}{tag?.path ?? props.node.attrs.label}
			</Link>
		</NodeViewWrapper>
	)
}

const ProjectMention = (props: {
	node: Node
	ref?: React.RefObject<HTMLAnchorElement | null>
}) => {
	const [project] = useAll(app.projects.where({ id: props.node.attrs.id })) ?? []

	return (
		<NodeViewWrapper as="span">
			<Link ref={props.ref} to={`/project/${project?.id ?? props.node.attrs.id}`} className="label secondary">
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
