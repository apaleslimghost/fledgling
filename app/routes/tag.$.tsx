import { Heading } from '@radix-ui/themes'
import { redirect } from 'react-router'
import Link from '~/components/link'
import NoteGrid from '~/components/note-grid'
import tagsByPath from '~/queries/tags-by-path'
import type { Route } from './+types/tag.$'

export async function loader({ params }: Route.LoaderArgs) {
	const path = params['*']
	if (!path) {
		throw redirect('/tags')
	}

	if (path.endsWith('/')) {
		throw redirect(`/tag/${path.slice(0, -1)}`)
	}

	return {
		...(await tagsByPath([path])),
		path,
	}
}

export default function Tag({ loaderData }: Route.ComponentProps) {
	const { notes, path, tags, relatedTags } = loaderData

	return (
		<>
			<Heading>#{path}</Heading>

			<ul>
				{tags.map((tag) => (
					<li key={tag.path}>
						<Link to={`/tag/${tag.path}`}>#{tag.path}</Link>
					</li>
				))}
			</ul>

			<NoteGrid notes={notes} />

			<ul>
				{relatedTags.map((tag) => (
					<li key={tag.path}>
						<Link to={`/tag/${tag.path}`}>#{tag.path}</Link>
					</li>
				))}
			</ul>
		</>
	)
}
