import { Prisma } from "@prisma/client";
import {Card, Text, Badge, Flex, Box, Checkbox} from '@radix-ui/themes'
import Link from "./link";

export default function TaskCard({ task }: { task: Prisma.TaskGetPayload<{ include: { tags: true } }> }) {
	return <Card>
		<Flex gap='3' align='center'>
			<Checkbox checked={task.completed} size='3' />

			<Box>
				<Text size='4' asChild>
					<Link to={`/task/${task.id}`}>
						{task.text}
					</Link>
				</Text>

				<Flex gap='1' wrap='wrap'>
					{task.tags.map(tag =>
						<Badge key={tag.id} asChild>
							<Link to={`/tag/${tag.path}`}>#{tag.path}</Link>
						</Badge>
					)}
				</Flex>
			</Box>
		</Flex>
	</Card>
}
