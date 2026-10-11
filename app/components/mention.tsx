import type { Node } from '@tiptap/pm/model'
import { NodeViewWrapper } from '@tiptap/react'
import { useMemo } from 'react'
import { Link } from 'react-router'
import { useRxQuery } from 'rxdb/plugins/react'
import { useWorkspace } from '~/data/context'
import database from '~/data/rxdb.client'
import { Icon } from './icon'
import { title } from '~/data/note'

export const TagMention = (props: {
	id: string,
	fallbackLabel: string,
	ref?: React.RefObject<HTMLAnchorElement | null>
}) => {
	const tagQuery = useMemo(
		() => ({
			selector: { id: props.id }
		}), [props.id]
	)

	const { results: [tag] } = useRxQuery({
		collection: database.tags,
		query: tagQuery
	})

	const workspaceId = useWorkspace()

	return (
		<NodeViewWrapper as="span">
			<Link ref={props.ref} to={`/workspace/${workspaceId}/tag/${tag?.path ?? props.id}`} className="label">
				<Icon icon='Hashtag' />
				{tag?.path ?? props.fallbackLabel}
			</Link>
		</NodeViewWrapper>
	)
}

export const ProjectMention = (props: {
	id: string,
	fallbackLabel: string,
	ref?: React.RefObject<HTMLAnchorElement | null>
}) => {
	const projectQuery = useMemo(
		() => ({
			selector: { id: props.id }
		}), [props.id]
	)

	const { results: [project] } = useRxQuery({
		collection: database.projects,
		query: projectQuery
	})

	const workspaceId = useWorkspace()

	return (
		<NodeViewWrapper as="span">
			<Link ref={props.ref} to={`/workspace/${workspaceId}/project/${project?.id ?? props.id}`} className="label secondary">
				<Icon icon='FolderKanban' />
				{project?.title ?? props.fallbackLabel}
			</Link>
		</NodeViewWrapper>
	)
}

export const NoteMention = (props: {
	id: string,
	fallbackLabel: string,
	ref?: React.RefObject<HTMLAnchorElement | null>
}) => {
	const noteQuery = useMemo(
		() => ({
			selector: { id: props.id }
		}), [props.id]
	)

	const { results: [note] } = useRxQuery({
		collection: database.notes,
		query: noteQuery
	})

	const workspaceId = useWorkspace()

	return (
		<NodeViewWrapper as="span">
			<Link ref={props.ref} to={`/workspace/${workspaceId}/note/${note?.id ?? props.id}`} className="label tertiary">
				<Icon icon='Note01' />
				{note ? title(note) : props.fallbackLabel}
			</Link>
		</NodeViewWrapper>
	)
}

export const MentionView = (props: {
	node: Node
	ref?: React.RefObject<HTMLAnchorElement | null>
}) => {
	switch (props.node.attrs.mentionSuggestionChar) {
		case '#':
			return <TagMention {...props} id={props.node.attrs.id} fallbackLabel={props.node.attrs.label} />
		case '@':
			return <ProjectMention {...props} id={props.node.attrs.id} fallbackLabel={props.node.attrs.label} />
		case '~':
			return <NoteMention {...props} id={props.node.attrs.id} fallbackLabel={props.node.attrs.label} />
	}

	return null
}
