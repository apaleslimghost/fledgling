import { addRxPlugin, createRxDatabase } from 'rxdb/plugins/core'
import { disableWarnings, RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema'
import { getRxStorageLocalstorage } from 'rxdb/plugins/storage-localstorage'
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'
import { getAjv, wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv'
import { type Collections, noteSchema, propertySchema, type Tag, tagSchema } from './rx-types'

const ajv = getAjv()
ajv.opts.allowUnionTypes = true

const storage =
	'window' in globalThis
		? wrappedValidateAjvStorage({ storage: getRxStorageLocalstorage() })
		: wrappedValidateAjvStorage({ storage: getRxStorageMemory() })

RxDBDevModePlugin.init = () => {} // fuck you and the tracking iframe you rode in on
addRxPlugin(RxDBDevModePlugin)
disableWarnings()

addRxPlugin(RxDBUpdatePlugin)
addRxPlugin(RxDBMigrationSchemaPlugin)

const database = await createRxDatabase<Collections>({
	name: 'fledgling',
	closeDuplicates: true,
	storage,
})

await database.addCollections({
	tags: {
		schema: tagSchema,
		migrationStrategies: {
			1: (oldDoc: Tag) => {
				oldDoc.properties = []
				return oldDoc
			},
		},
	},
	notes: { schema: noteSchema },
	properties: { schema: propertySchema },
})

Object.assign(globalThis, { database })

export default database
