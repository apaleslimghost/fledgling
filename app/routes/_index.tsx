import { useMemo } from 'react'
import { useRxQuery } from 'rxdb/plugins/react'
import NoteGrid from '~/components/note-grid'
import database from '~/lib/rxdb'

export default function Index() {
	const notesQuery = useMemo(
		() => ({
			collection: database.notes,
			query: {},
		}),
		[],
	)

	const { results: notes } = useRxQuery(notesQuery)

	return <NoteGrid notes={notes} className="h-full" />
}
