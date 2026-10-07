
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
	taskSchema,
	workspaceSchema,
	type Collections,
} from './schema'
import { RxDBLocalDocumentsPlugin } from 'rxdb/plugins/local-documents';


const ajv = getAjv()
ajv.opts.allowUnionTypes = true

const storage = wrappedValidateAjvStorage({ storage: getRxStorageLocalstorage() })

RxDBDevModePlugin.init = () => { } // fuck you and the tracking iframe you rode in on
addRxPlugin(RxDBDevModePlugin)
disableWarnings()

addRxPlugin(RxDBUpdatePlugin)
addRxPlugin(RxDBMigrationSchemaPlugin)
addRxPlugin(RxDBLocalDocumentsPlugin);

const database = await createRxDatabase<Collections>({
	name: 'fledgling',
	closeDuplicates: true,
	storage,
	localDocuments: true
})

await database.addCollections({
	tags: {
		schema: tagSchema,
	},
	notes: {
		schema: noteSchema,
		migrationStrategies: {
			1(note) {
				note.tasks = []
				return note
			},
			2(note) {
				delete note.title
				return note
			}
		}
	},
	projects: {
		schema: projectSchema,
	},
	workspaces: {
		schema: workspaceSchema,
	},
	tasks: {
		schema: taskSchema,
	},
})

Object.assign(globalThis, { database })

export default database
