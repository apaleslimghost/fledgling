import "react-router";
import { createRequestHandler } from "@react-router/express";
import { createRxServer, type RxServerAuthData } from 'rxdb-server/plugins/server';
import { RxServerAdapterExpress } from 'rxdb-server/plugins/adapter-express';
import database from "./data/rxdb";
import { replications } from "./data/replication.server";

type AuthData = { workspaceId: string }

const rxServer = await createRxServer({
	database,
	adapter: RxServerAdapterExpress,
	port: 443,
	authHandler: (headers): RxServerAuthData<AuthData> => {
		const [, workspaceId] = headers.authorization?.match(/^Bearer ([a-z\d]{24})$/) ?? []
		if (workspaceId) {
			return {
				data: { workspaceId },
				validUntil: Date.now() + 365 * 24 * 60 * 60 * 1000
			}
		}

		throw new Error('No workspace id in authorization header')
	},

});

export const app = rxServer.serverApp

rxServer.addReplicationEndpoint({
	name: `_replication/workspaces`,
	collection: database.collections.workspaces,
	queryModifier(authData: RxServerAuthData<AuthData>, query) {
		query.selector.id = { $eq: authData.data.workspaceId }
		return query
	}
})

rxServer.addReplicationEndpoint({
	name: `_replication/notes`,
	collection: database.collections.notes,
	queryModifier(authData: RxServerAuthData<AuthData>, query) {
		query.selector.workspace = { $eq: authData.data.workspaceId }
		return query
	}
})

rxServer.addReplicationEndpoint({
	name: `_replication/tags`,
	collection: database.collections.tags,
	queryModifier(authData: RxServerAuthData<AuthData>, query) {
		query.selector.workspace = { $eq: authData.data.workspaceId }
		return query
	}
})

rxServer.addReplicationEndpoint({
	name: `_replication/projects`,
	collection: database.collections.projects,
	queryModifier(authData: RxServerAuthData<AuthData>, query) {
		query.selector.workspace = { $eq: authData.data.workspaceId }
		return query
	}
})

rxServer.addReplicationEndpoint({
	name: `_replication/tasks`,
	collection: database.collections.tasks,
	queryModifier(authData: RxServerAuthData<AuthData>, query) {
		query.selector.workspace = { $eq: authData.data.workspaceId }
		return query
	}
})

app.use(
	createRequestHandler({
		build: () =>
			import("virtual:react-router/server-build"),
	}),
)
