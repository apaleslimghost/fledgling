import database from "./rxdb";
import { replicateServer } from 'rxdb-server/plugins/replication-server';

export const replications = await Promise.all(
	Object.entries(database.collections).map(
		([name, collection]) => replicateServer({
			collection,
			replicationIdentifier: `rxServer/${name}`,
			url: `/_replication/${name}/${collection.schema.version}`,
			push: {},
			pull: {}
		})
	)
)
