import { Note, Prisma } from "@prisma/client";
import {Card, Flex, Box, Checkbox, Heading} from '@radix-ui/themes'
import Link from "./link";
import { generateHTML } from "@tiptap/html";
import { extensions } from "./editor";

const NoteTitle = ({note}: {note: Note}) => {
	const title = note.text?.content?.find(
		node => node.type === 'title'
	)

	return <h1 dangerouslySetInnerHTML={{
		__html: title ? generateHTML(title, extensions) : 'untitled note'
	}} />
}

export default function NoteCard({ note }: { note: Prisma.NoteGetPayload<{ include: { tags: true } }> }) {
	return <Card>
		<Flex gap='3' align='center'>
			<Checkbox checked={note.completed} size='3' />

			<Box>
				<Link to={`/note/${note.id}`}>
					<NoteTitle note={note} />
				</Link>
			</Box>
		</Flex>
	</Card>
}
