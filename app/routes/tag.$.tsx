import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import tagsByPath from "~/queries/tags-by-path";
import {Box, Heading} from '@radix-ui/themes'
import TaskGrid from "~/components/task-grid";

export async function loader({params}: LoaderFunctionArgs) {
	const path = params['*']
	if(!path) {
		throw redirect('/tags')
	}

	if(path.endsWith('/')) {
		throw redirect(`/tag/${path.slice(0, -1)}`)
	}

	return {
		...await tagsByPath([path]),
		path
	}
}

export default function Tag() {
	const { tasks, path } = useLoaderData<typeof loader>()

	return <Box>
		<Heading>#{path}</Heading>

		<TaskGrid tasks={tasks} />
	</Box>
}
