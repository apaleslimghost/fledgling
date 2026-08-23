import Minisearch from 'minisearch'
import type { Project, Tag } from '../../schema'

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

export const projectSearch = new Minisearch<Project>({
	fields: ['title'],
	storeFields: ['title', 'id'],
	idField: 'id',
	searchOptions: {
		fuzzy: 0.2,
	},
})
