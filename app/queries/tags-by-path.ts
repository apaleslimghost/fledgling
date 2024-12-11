import uniqBy from "lodash/uniqBy"
import dbServer from "~/lib/db.server"

export default async function tagsByPath(paths: string[]) {
	const tags = await dbServer.tag.findMany({
		where: {
			OR: paths.flatMap(path => [
				{ path },
				{ path: {
					startsWith: path + '/'
				} }
			])
		},
		orderBy: {
			path: 'asc'
		},
		include: {
			notes: {
				include: {
					tags: true
				}
			}
		}
	})

	// sql? what's that
	const notes = uniqBy(tags.flatMap(tag => tag.notes), 'id')

	const relatedTags = uniqBy(notes.flatMap(note => note.tags.filter(
		tag => !tags.some(other => other.path === tag.path)
	)), 'path')

	return { tags, notes, relatedTags }
}
