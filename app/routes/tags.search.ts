import { LoaderFunctionArgs } from "@remix-run/node";
import dbServer from "~/lib/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const { searchParams } = new URL(request.url)

	const tags = await dbServer.tag.findMany({
		where: {
			path: {
				contains: searchParams.get('q') ?? ''
			}
		}
	})

	return { tags }
}
