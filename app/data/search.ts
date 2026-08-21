import Minisearch from 'minisearch'
import type { Tag } from '../../schema'

export const tagSearch = new Minisearch<Tag>({
	fields: ['path'],
	storeFields: ['path', 'id'],
	idField: 'path',
	tokenize: (text) => text.split('/'),
	searchOptions: {
		prefix: true,
		fuzzy: 0.2,
	},
})
