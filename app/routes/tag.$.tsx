import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import tagsByPath from "~/queries/tags-by-path";
import {Box, Heading} from '@radix-ui/themes'
import NoteGrid from "~/components/note-grid";
import Link from "~/components/link";

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
	const { notes, path, tags, relatedTags } = useLoaderData<typeof loader>()

	return <>
		<Heading>#{path}</Heading>

		<ul>
			{tags.map(tag => <li key={tag.path}>
				<Link to={`/tag/${tag.path}`}>#{tag.path}</Link>
			</li>)}
		</ul>

		<NoteGrid notes={notes} />

		<ul>
			{relatedTags.map(tag => <li key={tag.path}>
				<Link to={`/tag/${tag.path}`}>#{tag.path}</Link>
			</li>)}
		</ul>
	</>
}
