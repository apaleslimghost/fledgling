import Minisearch from 'minisearch'
import type { Note, Project, Tag } from './schema'

export const tagSearch = new Minisearch<Tag>({
	fields: ['path'],
	storeFields: ['path', 'id'],
	idField: 'path',
	tokenize: (text) => text.split('/'),
	searchOptions: {
		prefix: true,
		fuzzy: 0.5,
	},
})

export const projectSearch = new Minisearch<Project>({
	fields: ['title'],
	storeFields: ['title', 'id'],
	idField: 'id',
	searchOptions: {
		prefix: true,
		fuzzy: 0.5,
	},
})

export const noteSearch = new Minisearch<{ title: string, id: string }>({
	fields: ['title'],
	storeFields: ['title', 'id'],
	idField: 'id',
	searchOptions: {
		prefix: true,
		fuzzy: 0.5,
	},
})
