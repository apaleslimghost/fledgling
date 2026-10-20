import "react-router";
import { createRequestHandler } from "@react-router/express";
import { createRxServer } from 'rxdb-server/plugins/server';
import { RxServerAdapterExpress } from 'rxdb-server/plugins/adapter-express';
import database from "./data/rxdb";

const rxServer = await createRxServer({
	database,
	adapter: RxServerAdapterExpress,
	port: 443
});

export const app = rxServer.serverApp

for (const [name, collection] of Object.entries(database.collections)) {
	rxServer.addReplicationEndpoint({
		name: `_replication/${name}`,
		//@ts-expect-error why are you inferring this is Workspace
		collection
	})
}

app.use(
	createRequestHandler({
		build: () =>
			import("virtual:react-router/server-build"),
	}),
)
