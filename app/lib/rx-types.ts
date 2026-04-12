import type { JSONContent } from '@tiptap/react'
import type { RxCollection, RxDocument, RxJsonSchema } from 'rxdb'

export type Tag = {
	path: string
	properties: string[]
}

export type Note = {
	id: string
	tags: string[]
	title?: string
	text?: JSONContent
	propertyValues?: Record<string, Property['type']>
}

export type Property = {
	id: string
	name: string
	type: 'text' | 'number' | 'boolean' | 'tag' | 'note'
}

export const tagSchema: RxJsonSchema<Tag> = {
	type: 'object',
	properties: {
		path: { type: 'string', maxLength: 100 },
		properties: { type: 'array', items: { type: 'string' } },
	},
	required: ['path'],
	version: 1,
	primaryKey: 'path',
}

export const noteSchema: RxJsonSchema<Note> = {
	type: 'object',
	properties: {
		id: { type: 'string', maxLength: 100 },
		tags: { type: 'array', items: { type: 'string' } },
		title: { type: 'string' },
		text: { type: 'object' },
		propertyValues: { type: 'object' },
	},
	required: ['id', 'tags'],
	version: 1,
	primaryKey: 'id',
}

export const propertySchema: RxJsonSchema<Property> = {
	type: 'object',
	properties: {
		id: { type: 'string', maxLength: 100 },
		name: { type: 'string', maxLength: 100 },
		type: { type: 'string', enum: ['text', 'number', 'boolean', 'tag', 'note'] },
	},
	required: ['id', 'name', 'type'],
	version: 0,
	primaryKey: 'id',
}

export type TagDocument = RxDocument<Tag>
export type NoteDocument = RxDocument<Note>
export type Collections = {
	notes: RxCollection<Note>
	tags: RxCollection<Tag>
	properties: RxCollection<Property>
}
