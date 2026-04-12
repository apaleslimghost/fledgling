import { Card, cn } from '@heroui/react'
import { renderToReactElement } from '@tiptap/static-renderer'
import type { Note } from '~/lib/rx-types'
import { extensions } from './editor/extensions'
import Link from './link'
import { MentionView } from './mention'

const NoteContent = ({ note }: { note: Note }) => {
	const content = {
		...(note.text ?? { type: 'doc' }),
		content: note.text?.content?.slice(1),
	}

	return (
		<article className="prose">
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
						<h1 className={cn('text-2xl font-bold', { 'text-gray-500': !note.title })}>
							{note.title ?? 'untitled note'}
						</h1>
					</Link>
				</Card.Title>
			</Card.Header>

			<Card.Content>
				<NoteContent note={note} />
			</Card.Content>
		</Card>
	)
}
