import database from "./rxdb";
import { replicateMongoDB } from 'rxdb/plugins/replication-mongodb';
import { MongoClient } from 'mongodb';

const MONGO_URL = process.env.MONGO_URL ?? 'mongodb://localhost:27017'

const mongoClient = new MongoClient(MONGO_URL);

const DB = 'fledgling'

const db = mongoClient.db(DB)

export const replications = await Promise.all(
	Object.entries(database.collections).map(
		async ([name, collection]) => {
			await db.createCollection(name, {
				changeStreamPreAndPostImages: { enabled: true }
			})

			return replicateMongoDB({
				mongodb: {
					collectionName: name,
					connection: MONGO_URL,
					databaseName: DB
				},
				collection,
				replicationIdentifier: `mongodb/${name}`,
				push: { batchSize: 50 },
				pull: { batchSize: 50 }
			})
		}
	)
)
