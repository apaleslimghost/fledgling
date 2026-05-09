import { useMemo } from 'react'
import { useRxQuery } from 'rxdb/plugins/react'
import { ListView } from '~/components/note-views'
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

	return <ListView notes={notes} />
}
