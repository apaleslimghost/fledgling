import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import dbServer from "~/lib/db.server";
import tagsByPath from "~/queries/tags-by-path";
import {Box, Spinner} from '@radix-ui/themes'
import { EditorEvents, JSONContent } from '@tiptap/react'
import { Node } from "@tiptap/pm/model";
import { useCallback, useEffect, useState } from "react";
import debounce from "lodash/debounce";
import { withZod } from "@rvf/zod";
import { validationError } from "@rvf/remix";
import Editor from "~/components/editor";
import { Mention, MentionNodeAttrs } from "@tiptap/extension-mention";

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

	const note = await dbServer.note.findUniqueOrThrow({
		where: {
			id
		},
		include: {
			tags: true
		}
	})

	const { tags, notes: relatedNotes } = await tagsByPath(
		note.tags.map(tag => tag.path)
	)

	return {note, tags, relatedNotes}
}

interface MentionNode extends JSONContent {
	type: 'mention'
	attrs: MentionNodeAttrs
}

function isNode<T extends JSONContent>(type: T['type'], obj: unknown): obj is T {
	if(obj && typeof obj === 'object' && "type" in obj && obj.type === type) {
		return true
	}

	return false
}

function* collect<T extends JSONContent>(type: T["type"], tree: JSONContent): Generator<T> {
	if(isNode<T>(type, tree)) {
		yield tree
	}

	for(const child of tree.content ?? []) {
		yield* collect(type, child)
	}
}

export async function action({ request, params }: ActionFunctionArgs) {
	const { id } = QuerySchema.parse(params)
	const formData = await request.formData()

	const result = await actionValidator.validate(formData)

	if(result.error) {
		return validationError(result.error, result.submittedData)
	}

	const tags = Array.from(collect<MentionNode>('mention', result.data.text), node => node.attrs.id).filter(
		tag => tag !== null
	)

	await dbServer.note.update({
		where: { id },
		data: {
			...result.data,
			tags: {
				set: [],
				connectOrCreate: tags.map(
					path => ({
						where: { path },
						create: { path }
					})
				)
			}
		}
	})

	return { ok: true }
}

export default function Note() {
	const {note} = useLoaderData<typeof loader>()
	const fetcher = useFetcher()

	const onChange = useCallback(debounce(
		({ editor }: EditorEvents['update']) => {
			const formData = new FormData()
			formData.set('text', JSON.stringify(editor.getJSON()))
			fetcher.submit(formData, { method: 'post' })
		},
		200
	), [fetcher, note])

	return <Box flexGrow='1'>
		<Editor
			onUpdate={onChange}
			content={note.text ?? undefined}
			autofocus={!note.text}
		/>
	</Box>
}
