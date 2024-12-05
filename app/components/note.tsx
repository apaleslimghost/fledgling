import { Prisma } from "@prisma/client";
import {Card, Flex, Box, Checkbox} from '@radix-ui/themes'
import { EditorProvider } from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";

export default function NoteCard({ note }: { note: Prisma.NoteGetPayload<{ include: { tags: true } }> }) {
	return <Card>
		<Flex gap='3' align='center'>
			<Checkbox checked={note.completed} size='3' />

			<Box>
				<EditorProvider extensions={[StarterKit]} content={note.text ?? undefined} editable={false} />
			</Box>
		</Flex>
	</Card>
}
