import type { Route } from './+types/tags.search'

export async function loader({ request }: Route.LoaderArgs) {
	const { searchParams } = new URL(request.url)

	// const tags = await dbServer.tag.findMany({
	// 	where: {
	// 		path: {
	// 			contains: searchParams.get('q') ?? '',
	// 		},
	// 	},
	// })

	return { tags: [] }
}
