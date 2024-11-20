import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import dbServer from "~/lib/db.server";

export async function loader({params}: LoaderFunctionArgs) {
	const path = params['*']
	if(!path) {
		throw redirect('/tags')
	}

	const tag = await dbServer.tag.findUniqueOrThrow({
		where: {
			path
		},
		include: {
			tasks: true
		}
	})

	return {tag}
}

export default function Tag() {
	const { tag } = useLoaderData<typeof loader>()

	return <>
		<h1>#{tag.path}</h1>

		<ul>
			{tag.tasks.map(task => <li key={task.id}>{task.text}</li>)}
		</ul>
	</>
}
