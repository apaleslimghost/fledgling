import { Card, Chip } from '@heroui/react'
import { generateHTML } from '@tiptap/html'
import { Link as RouterLink } from 'react-router'
import type { Note } from '~/lib/rx-types'
import { extensions } from './editor'
import Link from './link'

const NoteTitle = ({ note }: { note: Note }) => {
	const title = note.text?.content?.find((node) => node.type === 'title')

	return (
		<h1
			// biome-ignore lint/security/noDangerouslySetInnerHtml: trust me bro
			dangerouslySetInnerHTML={{
				__html: title ? generateHTML(title, extensions) : 'untitled note',
			}}
			className="text-2xl font-bold"
		/>
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
				{note.tags.map((tag) => (
					<RouterLink to={`/tag/${tag}`} key={tag}>
						<Chip color="accent" variant="soft">
							#{tag}
						</Chip>
					</RouterLink>
				))}
			</Card.Content>
		</Card>
	)
}
