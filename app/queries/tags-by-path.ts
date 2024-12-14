import uniqBy from "lodash/uniqBy"
import dbServer from "~/lib/db.server"
import set from 'lodash/set'
import { Prisma } from "@prisma/client"

type TagPathTree = {
	notes:
	children: Record<string, TagPathTree>
}

type TagWithNotes = Prisma.TagGetPayload<{
	include: {
		notes: true
	}
}>

const intersperse = <T,>(array: T[], inter: T): T[] => array.length <= 1 ? array : [array[0], inter, ...intersperse(array.slice(1), inter)]

const buildTree = (tags: TagWithNotes[]): TagPathTree => tags.reduce(
	(tree, tag) => set(tree, ['children', ...intersperse(tag.path.split('/'), 'children')], { notes: tag.notes, children: {} }),
	{ children: {}, notes: [] }
)

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
