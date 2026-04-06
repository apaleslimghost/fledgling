import uniqBy from 'lodash/uniqBy'
import type { Note, Tag } from '~/lib/rx-types'

export default async function tagsByPath(paths: string[]): Promise<{
	tags: Tag[]
	notes: Note[]
	relatedTags: Tag[]
}> {
	// const tags = await dbServer.tag.findMany({
	// 	where: {
	// 		OR: paths.flatMap((path) => [
	// 			{ path },
	// 			{
	// 				path: {
	// 					startsWith: `${path}/`,
	// 				},
	// 			},
	// 		]),
	// 	},
	// 	orderBy: {
	// 		path: 'asc',
	// 	},
	// 	include: {
	// 		notes: {
	// 			include: {
	// 				tags: true,
	// 			},
	// 		},
	// 	},
	// })

	// // sql? what's that
	// const notes = uniqBy(
	// 	tags.flatMap((tag) => tag.notes),
	// 	'id',
	// )

	// const relatedTags = uniqBy(
	// 	notes.flatMap((note) =>
	// 		note.tags.filter((tag) => !tags.some((other) => other.path === tag.path)),
	// 	),
	// 	'path',
	// )

	return { tags: [], notes: [], relatedTags: [] }
}
