import { Outlet } from "react-router";
import { Sidebar } from "~/components/sidebar";
import type { Route } from "./+types/_root";
import { isCuid } from "@paralleldrive/cuid2";
import { Workspace } from "~/data/context";
import database from "~/data/rxdb.client";
import { useLiveRxQuery } from "rxdb/plugins/react";
import type { Session } from "~/data/schema";
import { useMemo } from "react";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	if (!isCuid(params.workspaceId)) {
		throw new Error(`Invalid workspace ID ${params.workspaceId}`)
	}

	const session = await database.getLocal<Session>('session')
	if (session?.get('workspaceId') !== params.workspaceId) {
		await database.upsertLocal<Session>('session', { workspaceId: params.workspaceId })
	}
}

export default function ({ params, loaderData }: Route.ComponentProps) {
	const query = useMemo(() => ({
		selector: {
			workspace: params.workspaceId
		}
	}), [params.workspaceId])

	const { results: tags } = useLiveRxQuery({
		collection: database.tags,
		query
	})

	const { results: notes } = useLiveRxQuery({
		collection: database.notes,
		query
	})

	const tagsWithNotes = tags.map(({ path, id, ...props }) => ({
		...props,
		path,
		notes: notes.filter((note) => note.tags.includes(id)),
	}))

	const { results: projects } = useLiveRxQuery({
		collection: database.projects,
		query
	})

	return <Workspace.Provider value={params.workspaceId}>
		<main className="panels">
			<Sidebar tags={tagsWithNotes} projects={projects} workspaceId={params.workspaceId} />
			<Outlet />
		</main>
	</Workspace.Provider>
}
