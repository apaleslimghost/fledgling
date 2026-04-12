import { Card } from '@heroui/react'
import { renderToReactElement } from '@tiptap/static-renderer'
import type { Note } from '~/lib/rx-types'
import { extensions } from './editor/extensions'
import Link from './link'
import { MentionView } from './mention'

const NoteTitle = ({ note }: { note: Note }) => {
	const title = note.text?.content?.find((node) => node.type === 'title')

	return title ? (
		renderToReactElement({ content: title, extensions })
	) : (
		<h1 className="text-2xl font-bold">untitled note</h1>
	)
}

const NoteContent = ({ note }: { note: Note }) => {
	const content = {
		...(note.text ?? { type: 'doc' }),
		content: note.text?.content?.slice(1),
	}

	return (
		<article>
			{renderToReactElement({
				content,
				extensions,
				options: {
					nodeMapping: {
						mention: MentionView,
					},
				},
			})}
		</article>
	)
}

export default function NoteCard({ note }: { note: Note }) {
	return (
		<Card>
			<Card.Header>
				<Card.Title>
					<Link to={`/note/${note.id}`}>
						<NoteTitle note={note} />
					</Link>
				</Card.Title>
			</Card.Header>

			<Card.Content>
				<NoteContent note={note} />
			</Card.Content>
		</Card>
	)
}
