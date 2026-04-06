import { addRxPlugin, createRxDatabase } from 'rxdb/plugins/core'
import { disableWarnings, RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { getRxStorageLocalstorage } from 'rxdb/plugins/storage-localstorage'
import { getAjv, wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv'
import { noteSchema, tagSchema } from './rx-types'

const ajv = getAjv()
ajv.opts.allowUnionTypes = true

const storage = wrappedValidateAjvStorage({ storage: getRxStorageLocalstorage() })

RxDBDevModePlugin.init = () => {} // fuck you and the tracking iframe you rode in on
addRxPlugin(RxDBDevModePlugin)
disableWarnings()

const database = await createRxDatabase({
	name: 'fledgling',
	closeDuplicates: true,
	storage,
})

await database.addCollections({
	tags: { schema: tagSchema },
	notes: { schema: noteSchema },
})

export default database
