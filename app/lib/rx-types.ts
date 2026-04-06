import type { JSONContent } from '@tiptap/react'
import type { RxCollection, RxDocument, RxJsonSchema } from 'rxdb'

export type Tag = {
	path: string
}

export type Note = {
	id: string
	tags: string[]
	text: JSONContent
}

export const tagSchema: RxJsonSchema<Tag> = {
	type: 'object',
	properties: {
		path: { type: 'string', maxLength: 100 },
	},
	required: ['path'],
	version: 0,
	primaryKey: 'path',
}

export const noteSchema: RxJsonSchema<Note> = {
	type: 'object',
	properties: {
		id: { type: 'string', maxLength: 100 },
		tags: { type: 'array', items: { type: 'string' } },
		text: { type: 'object' },
	},
	required: ['id', 'tags'],
	version: 0,
	primaryKey: 'id',
}

export type TagDocument = RxDocument<Tag>
export type NoteDocument = RxDocument<Note>
export type Collections = {
	notes: RxCollection<Note>
	tags: RxCollection<Tag>
}
