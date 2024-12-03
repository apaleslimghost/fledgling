import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import dbServer from "~/lib/db.server";

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

	return {task}
}

export default function Task() {
	const {task} = useLoaderData<typeof loader>()

	return <>
		<h1>{task.text}</h1>

		<ul>
			{task.tags.map(tag => <li key={tag.path}>
				<Link to={`/tag/${tag.path}`}>#{tag.path}</Link>
			</li>)}
		</ul>
	</>
}
