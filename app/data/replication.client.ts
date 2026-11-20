import { createContext } from "react";
import database from "./rxdb";
import { replicateServer, RxServerReplicationState } from 'rxdb-server/plugins/replication-server';
import type { RxReplicationState } from "rxdb/plugins/replication";

export const replicateWorkspace = (workspaceId: string) => Object.fromEntries(

	Object.entries(database.collections).map(
		([name, collection]) => [name, replicateServer({
			collection,
			replicationIdentifier: `rxServer/${name}`,
			url: `/_replication/${name}/${collection.schema.version}`,
			headers: {
				Authorization: `Bearer ${workspaceId}`
			},
			push: {},
			pull: {}
		})]
	)
)

export const ReplicationsContext = createContext<Record<string, RxServerReplicationState<unknown>> | null>(null)
