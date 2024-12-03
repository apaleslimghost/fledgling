import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, redirect, useLoaderData } from "@remix-run/react";
import dbServer from "~/lib/db.server";
import uniqBy from 'lodash/uniqBy'

export async function loader({params}: LoaderFunctionArgs) {
	const path = params['*']
	if(!path) {
		throw redirect('/tags')
	}

	if(path.endsWith('/')) {
		throw redirect(`/tag/${path.slice(0, -1)}`)
	}

	const tag = await dbServer.tag.findUnique({
		where: {
			path
		},
		include: {
			tasks: true
		}
	})

	const descendents = await dbServer.tag.findMany({
		where: {
			path: {
				startsWith: path + '/'
			}
		},
		include: {
			tasks: true
		}
	})

	// sql? what's that
	const tasks = uniqBy([
		...(tag ? tag.tasks : []),
		...descendents.flatMap(tag => tag.tasks)
	], 'id')

	return { tag, descendents, path, tasks }
}

export default function Tag() {
	const { tasks, descendents, path } = useLoaderData<typeof loader>()

	return <>
		<h1>#{path}</h1>

		<ul>
			{descendents.map(tag => <li key={tag.path}>
				<Link to={`/tag/${tag.path}`}>#{tag.path}</Link>
			</li>)}
		</ul>

		<ul>
			{tasks.map(task => <li key={task.id}>
				<Link to={`/task/${task.id}`}>{task.text}</Link></li>)}
		</ul>
	</>
}
