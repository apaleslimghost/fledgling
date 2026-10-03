import { redirect } from "react-router";
import { cuid } from "~/data/cuid";
import database from "~/data/rxdb.client";

export async function clientLoader() {
	const workspaceId = cuid()
	// TODO session
	await database.workspaces.insert({ id: workspaceId })

	return redirect(`/workspace/${workspaceId}`)
}

export default () => null
