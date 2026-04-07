import { useMemo } from 'react'
import { redirect } from 'react-router'
import { type UseRxQueryOptions, useRxQuery } from 'rxdb/plugins/react'
import Link from '~/components/link'
import NoteGrid from '~/components/note-grid'
import type { Note, Tag } from '~/lib/rx-types'
import database from '~/lib/rxdb'
import tagsByPath from '~/queries/tags-by-path'
import type { Route } from './+types/tag'

export async function clientLoader({ params }: Route.LoaderArgs) {
	const path = params['*']
	if (!path) {
		return redirect('/tags')
	}

	if (path.endsWith('/')) {
		return redirect(`/tag/${path.slice(0, -1)}`)
	}
}

export default function TagPage({ params }: Route.ComponentProps) {
	const path = params['*']
	const tagsQuery: UseRxQueryOptions<Tag> = useMemo(
		() => ({
			collection: database.tags,
			query: {
				selector: {
					path: {
						$regex: new RegExp(`^${path}`).source,
					},
				},
			},
		}),
		[path],
	)

	const { results: tags } = useRxQuery(tagsQuery)

	const notesQuery: UseRxQueryOptions<Note> = useMemo(
		() => ({
			collection: database.notes,
			query: {
				selector: {
					tags: {
						$regex: new RegExp(`^${path}`).source,
					},
				},
			},
		}),
		[path],
	)

	const { results: notes } = useRxQuery(notesQuery)

	return (
		<>
			<h1 className="text-4xl font-bold">#{path}</h1>

			<ul>
				{tags.map((tag) => (
					<li key={tag.path}>
						<Link to={`/tag/${tag.path}`}>#{tag.path}</Link>
					</li>
				))}
			</ul>

			<NoteGrid notes={notes} />

			{/*<ul>
				{relatedTags.map((tag) => (
					<li key={tag.path}>
						<Link to={`/tag/${tag.path}`}>#{tag.path}</Link>
					</li>
				))}
			</ul>*/}
		</>
	)
}
