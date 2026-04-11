import { Breadcrumbs } from '@heroui/react'
import { useMemo } from 'react'
import { redirect } from 'react-router'
import { type UseRxQueryOptions, useRxQuery } from 'rxdb/plugins/react'
import Link from '~/components/link'
import NoteGrid from '~/components/note-grid'
import type { Note, Tag } from '~/lib/rx-types'
import database from '~/lib/rxdb'
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

	const tagParts = path.split('/')

	return (
		<div className="h-full flex flex-col">
			<header>
				{tagParts.length > 1 && (
					<Breadcrumbs className="mb-4">
						{tagParts.map((part, index) => (
							<Breadcrumbs.Item key={tagParts.slice(0, index + 1).join('/')}>
								{index === tagParts.length - 1 ? (
									part
								) : (
									<Link to={`/tag/${tagParts.slice(0, index + 1).join('/')}`}>
										{index === 0 ? '#' : ''}
										{part}
									</Link>
								)}
							</Breadcrumbs.Item>
						))}
					</Breadcrumbs>
				)}

				<h1 className="text-4xl font-bold mb-6">{tagParts[tagParts.length - 1]}</h1>
			</header>

			<NoteGrid notes={notes} className="grow" />
		</div>
	)
}
