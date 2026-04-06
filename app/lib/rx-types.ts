import type { JSONContent } from '@tiptap/react'
import type { RxJsonSchema } from 'rxdb'

export type Tag = {
	path: string
	updated: Date
}

export type Note = {
	id: string
	tags: string[]
	text: JSONContent
	updated: Date
}

export const tagSchema: RxJsonSchema<Tag> = {
	type: 'object',
	properties: {
		path: { type: 'string', maxLength: 100 },
		updated: { type: 'string', format: 'date-time' },
	},
	required: ['path', 'updated'],
	version: 0,
	primaryKey: 'path',
}

export const noteSchema: RxJsonSchema<Note> = {
	type: 'object',
	properties: {
		id: { type: 'string', maxLength: 100 },
		tags: { type: 'array', items: { type: 'string' } },
		text: { type: 'object' },
		updated: { type: 'string', format: 'date-time' },
	},
	required: ['id', 'tags', 'text'],
	version: 0,
	primaryKey: 'id',
}
