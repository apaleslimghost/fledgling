import { Note, Prisma } from "@prisma/client";
import {Card, Flex, Box, Checkbox, Heading} from '@radix-ui/themes'
import Link from "./link";

const noteSummary = (note: Note): {
	heading: string,
} => {
	const heading = note.text?.content?.find(
		node => node.type === 'heading' && node.attrs?.level === 1
	)
	const firstParagraph = note.text?.content?.find(
		node => node.type === 'paragraph'
	)

	return {
		heading: heading?.content?.[0].text ?? firstParagraph?.content?.[0].text ?? 'unnamed note'
	}
}

export default function NoteCard({ note }: { note: Prisma.NoteGetPayload<{ include: { tags: true } }> }) {
	const {heading} = noteSummary(note)

	return <Card>
		<Flex gap='3' align='center'>
			<Checkbox checked={note.completed} size='3' />

			<Box>
				<Heading>
					<Link to={`/note/${note.id}`}>
						{heading}
					</Link>
				</Heading>
			</Box>
		</Flex>
	</Card>
}
