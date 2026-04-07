import { addRxPlugin, createRxDatabase, type RxCollection } from 'rxdb/plugins/core'
import { disableWarnings, RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { getRxStorageLocalstorage } from 'rxdb/plugins/storage-localstorage'
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory'
import { getAjv, wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv'
import { type Collections, type Note, noteSchema, type Tag, tagSchema } from './rx-types'

const ajv = getAjv()
ajv.opts.allowUnionTypes = true

const storage =
	'window' in globalThis
		? wrappedValidateAjvStorage({ storage: getRxStorageLocalstorage() })
		: wrappedValidateAjvStorage({ storage: getRxStorageMemory() })

RxDBDevModePlugin.init = () => {} // fuck you and the tracking iframe you rode in on
addRxPlugin(RxDBDevModePlugin)
disableWarnings()

const database = await createRxDatabase<Collections>({
	name: 'fledgling',
	closeDuplicates: true,
	storage,
})

await database.addCollections({
	tags: { schema: tagSchema },
	notes: { schema: noteSchema },
})

Object.assign(globalThis, { database })

export default database
