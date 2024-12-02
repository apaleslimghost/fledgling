import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import dbServer from "~/lib/db.server";

export async function loader({params}: LoaderFunctionArgs) {
	const path = params['*']
	if(!path) {
		throw redirect('/tags')
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

	const tasks = [
		...(tag ? tag.tasks : []),
		...descendents.flatMap(tag => tag.tasks)
	]

	return { tag, descendents, path, tasks }
}

export default function Tag() {
	const { tasks, descendents, path } = useLoaderData<typeof loader>()

	return <>
		<h1>#{path}</h1>

		<ul>
			{descendents.map(tag => <li key={tag.path}>
				<a href={`/tag/${tag.path}`}>#{tag.path}</a>
			</li>)}
		</ul>

		<ul>
			{tasks.map(task => <li key={task.id}>{task.text}</li>)}
		</ul>
	</>
}
