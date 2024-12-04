import { Prisma } from "@prisma/client";
import {Card, Flex, Box, Checkbox} from '@radix-ui/themes'
import { EditorProvider } from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";

export default function TaskCard({ task }: { task: Prisma.TaskGetPayload<{ include: { tags: true } }> }) {
	return <Card>
		<Flex gap='3' align='center'>
			<Checkbox checked={task.completed} size='3' />

			<Box>
				<EditorProvider extensions={[StarterKit]} content={task.text ?? undefined} editable={false} />
			</Box>
		</Flex>
	</Card>
}
