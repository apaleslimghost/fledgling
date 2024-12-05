import { Prisma } from "@prisma/client";
import {Card, Flex, Box, Checkbox} from '@radix-ui/themes'
import Editor from "./editor";

export default function NoteCard({ note }: { note: Prisma.NoteGetPayload<{ include: { tags: true } }> }) {
	return <Card>
		<Flex gap='3' align='center'>
			<Checkbox checked={note.completed} size='3' />

			<Box>
				<Editor content={note.text ?? undefined} editable={false} />
			</Box>
		</Flex>
	</Card>
}
