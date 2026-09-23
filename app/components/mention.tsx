import type { Node } from '@tiptap/pm/model'
import { NodeViewWrapper } from '@tiptap/react'
import { Link } from 'react-router'
import { useQuery } from '@rocicorp/zero/react'
import { queries } from '~/zero/queries'


const TagMention = (props: {
	node: Node
	ref?: React.RefObject<HTMLAnchorElement | null>
}) => {
	const [tag] = useQuery(queries.tag.byId({ id: props.node.attrs.id }))

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
	const [project] = useQuery(queries.project.byId({ id: props.node.attrs.id }))

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
