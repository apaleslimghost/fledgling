import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, redirect, useLoaderData } from "@remix-run/react";
import tagsByPath from "~/queries/tags-by-path";

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

	return <>
		<h1>#{path}</h1>

		<ul>
			{tags.map(tag => <li key={tag.path}>
				<Link to={`/tag/${tag.path}`}>#{tag.path}</Link>
			</li>)}
		</ul>

		<ul>
			{tasks.map(task => <li key={task.id}>
				<Link to={`/task/${task.id}`}>{task.text}</Link></li>)}
		</ul>
	</>
}
