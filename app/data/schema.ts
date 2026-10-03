import type { JSONContent } from '@tiptap/react'
import type { RxCollection, RxDocument, RxJsonSchema } from 'rxdb'

export type Workspace = {
	id: string,
}

export type Tag = {
	id: string
	path: string
	workspace: string
}

export type Note = {
	id: string
	tags: string[]
	projects: string[]
	title?: string
	content?: JSONContent
	workspace: string
}

export type Project = {
	id: string
	title: string
	workspace: string
}

export const workspaceSchema: RxJsonSchema<Workspace> = {
	type: 'object',
	properties: {
		id: { type: 'string', maxLength: 36 },
	},
	required: ['id'],
	version: 0,
	primaryKey: 'id',
}

export const tagSchema: RxJsonSchema<Tag> = {
	type: 'object',
	properties: {
		id: { type: 'string', maxLength: 36 },
		path: { type: 'string', maxLength: 100 },
		workspace: { type: 'string', ref: 'workspace' },
	},
	required: ['id', 'path'],
	version: 0,
	primaryKey: 'id',
}

export const projectSchema: RxJsonSchema<Project> = {
	type: 'object',
	properties: {
		id: { type: 'string', maxLength: 36 },
		title: { type: 'string', maxLength: 100 },
		workspace: { type: 'string', ref: 'workspace' },
	},
	required: ['id', 'title'],
	version: 0,
	primaryKey: 'id',
}

export const noteSchema: RxJsonSchema<Note> = {
	type: 'object',
	properties: {
		id: { type: 'string', maxLength: 100 },
		tags: { type: 'array', ref: 'tag', items: { type: 'string' } },
		projects: { type: 'array', ref: 'project', items: { type: 'string' } },
		workspace: { type: 'string', ref: 'workspace' },
		title: { type: 'string' },
		content: { type: 'object' },
	},
	required: ['id', 'tags'],
	version: 0,
	primaryKey: 'id',
}


export type TagDocument = RxDocument<Tag>
export type NoteDocument = RxDocument<Note>
export type ProjectDocument = RxDocument<Project>
export type WorkspaceDocument = RxDocument<Workspace>

export type Collections = {
	notes: RxCollection<Note>
	tags: RxCollection<Tag>
	projects: RxCollection<Project>
	workspaces: RxCollection<Workspace>
}
