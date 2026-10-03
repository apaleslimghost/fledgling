
import { addRxPlugin, createRxDatabase } from 'rxdb/plugins/core'
import { disableWarnings, RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema'
import { getRxStorageLocalstorage } from 'rxdb/plugins/storage-localstorage'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'
import { getAjv, wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv'
import {
	noteSchema,
	projectSchema,
	tagSchema,
	workspaceSchema,
	type Collections,
} from './schema'


const ajv = getAjv()
ajv.opts.allowUnionTypes = true

const storage = wrappedValidateAjvStorage({ storage: getRxStorageLocalstorage() })

RxDBDevModePlugin.init = () => { } // fuck you and the tracking iframe you rode in on
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
	},
	notes: {
		schema: noteSchema,
	},
	projects: {
		schema: projectSchema,
	},
	workspaces: {
		schema: workspaceSchema,
	},
})

Object.assign(globalThis, { database })

export default database
