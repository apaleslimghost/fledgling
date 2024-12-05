import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import dbServer from "~/lib/db.server";
import tagsByPath from "~/queries/tags-by-path";
import {Box} from '@radix-ui/themes'
import { EditorEvents, EditorProvider, JSONContent } from '@tiptap/react'
import {StarterKit} from '@tiptap/starter-kit'
import { useCallback } from "react";
import debounce from "lodash/debounce";
import { withZod } from "@rvf/zod";
import { validationError } from "@rvf/remix";

const ActionSchema = z.object({
	text: z.string().transform(
		text => JSON.parse(text) as JSONContent
	)
})

const actionValidator = withZod(ActionSchema)

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

export async function action({ request, params }: ActionFunctionArgs) {
	const { id } = QuerySchema.parse(params)
	const formData = await request.formData()

	const result = await actionValidator.validate(formData)

	if(result.error) {
		return validationError(result.error, result.submittedData)
	}

	await dbServer.task.update({
		where: { id },
		data: result.data
	})

	return { ok: true }
}

export default function Task() {
	const {task} = useLoaderData<typeof loader>()
	const fetcher = useFetcher()

	const onChange = useCallback(debounce(
		({ editor }: EditorEvents['update']) => {
			const formData = new FormData()
			formData.set('text', JSON.stringify(editor.getJSON()))
			fetcher.submit(formData, { method: 'post' })
		},
		200
	), [fetcher, task])

	return <Box flexGrow='1'>
		<EditorProvider
			onUpdate={onChange}
			extensions={[StarterKit]}
			content={task.text ?? undefined}
			autofocus={!task.text}
		/>
	</Box>
}
