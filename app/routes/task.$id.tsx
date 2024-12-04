import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import dbServer from "~/lib/db.server";
import tagsByPath from "~/queries/tags-by-path";
import {Box, Heading} from '@radix-ui/themes'
import Link from "~/components/link";
import { EditorProvider } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const QuerySchema = z.object({
	id: z.coerce.number()
})

export async function loader({params}: LoaderFunctionArgs) {
	const { id } = QuerySchema.parse(params)

	const task = await dbServer.task.findUniqueOrThrow({
		where: {
			id
		},
		include: {
			tags: true
		}
	})

	const { tags, tasks: relatedTasks } = await tagsByPath(
		task.tags.map(tag => tag.path)
	)

	return {task, tags, relatedTasks}
}

export default function Task() {
	const {task} = useLoaderData<typeof loader>()

	return <Box>
		<EditorProvider extensions={[StarterKit]} content={task.text ?? undefined}></EditorProvider>
	</Box>
}
