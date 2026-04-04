import NoteGrid from '~/components/note-grid'
import dbServer from '~/lib/db.server'
import type { Route } from './+types/_index'

export async function loader() {
	return {
		notes: await dbServer.note.findMany({
			include: { tags: true },
		}),
	}
}

export default function Index({ loaderData }: Route.ComponentProps) {
	return <NoteGrid notes={loaderData.notes} />
}
