import { Badge, Box, Card, Checkbox, Flex, Heading } from '@radix-ui/themes'
import { generateHTML } from '@tiptap/html'
import type { Note } from '~/lib/rx-types'
import { extensions } from './editor'
import Link from './link'

const NoteTitle = ({ note }: { note: Note }) => {
	const title = note.text?.content?.find((node) => node.type === 'title')

	return (
		<Heading
			// biome-ignore lint/security/noDangerouslySetInnerHtml: trust me bro
			dangerouslySetInnerHTML={{
				__html: title ? generateHTML(title, extensions) : 'untitled note',
			}}
		/>
	)
}

export default function NoteCard({ note }: { note: Note }) {
	return (
		<Card variant="surface">
			<Flex gap="3" align="center">
				<Box>
					<Link to={`/note/${note.id}`}>
						<NoteTitle note={note} />
					</Link>

					<Flex gap="1" wrap="wrap">
						{note.tags.map((tag) => (
							<Link to={`/tag/${tag}`} key={tag}>
								<Badge>#{tag}</Badge>
							</Link>
						))}
					</Flex>
				</Box>
			</Flex>
		</Card>
	)
}
