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
			tasks: true
		}
	})

	// sql? what's that
	const tasks = uniqBy(tags.flatMap(tag => tag.tasks), 'id')

	return { tags, tasks }
}
