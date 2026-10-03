import { redirect } from "react-router";
import { cuid } from "~/data/cuid";
import database from "~/data/rxdb.client";
import type { Session } from "~/data/schema";

export async function clientLoader() {
	const session = await database.getLocal<Session>('session')

	const workspaceId: string = session?.get('workspaceId') ?? cuid()

	if (!session) {
		await database.workspaces.insert({ id: workspaceId })
		await database.upsertLocal<Session>('session', { workspaceId })
	}

	return redirect(`/workspace/${workspaceId}`)
}

export default () => null
