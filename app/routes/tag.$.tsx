import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import Link from "~/components/link";
import tagsByPath from "~/queries/tags-by-path";
import {Box, Heading} from '@radix-ui/themes'

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
	const { tasks, tags, path } = useLoaderData<typeof loader>()

	return <Box>
		<Heading>#{path}</Heading>

		<ul>
			{tags.map(tag => <li key={tag.path}>
				<Link to={`/tag/${tag.path}`}>#{tag.path}</Link>
			</li>)}
		</ul>

		<ul>
			{tasks.map(task => <li key={task.id}>
				<Link to={`/task/${task.id}`}>{task.text}</Link></li>)}
		</ul>
	</Box>
}
