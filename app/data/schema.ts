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
	tasks: string[]
	content?: JSONContent
	workspace: string
}

export type Project = {
	id: string
	title: string
	workspace: string
}

export type Session = {
	workspaceId: string
}

export type Task = {
	id: string
	note: string
	content: JSONContent
	status: 'todo' | 'in-progress' | 'done' | 'archived'
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

export const taskSchema: RxJsonSchema<Task> = {
	type: 'object',
	properties: {
		id: { type: 'string', maxLength: 36 },
		note: { type: 'string', ref: 'note' },
		content: { type: 'object' },
		status: { type: 'string', enum: ['todo', 'in-progress', 'done', 'archived'] },
	},
	required: ['id', 'note', 'content', 'status'],
	version: 0,
	primaryKey: 'id',
}

export const noteSchema: RxJsonSchema<Note> = {
	type: 'object',
	properties: {
		id: { type: 'string', maxLength: 100 },
		tags: { type: 'array', ref: 'tag', items: { type: 'string' } },
		projects: { type: 'array', ref: 'project', items: { type: 'string' } },
		tasks: { type: 'array', ref: 'task', items: { type: 'string' } },
		workspace: { type: 'string', ref: 'workspace' },
		content: { type: 'object' },
	},
	required: ['id', 'tags'],
	version: 2,
	primaryKey: 'id',
}


export type TagDocument = RxDocument<Tag>
export type NoteDocument = RxDocument<Note>
export type ProjectDocument = RxDocument<Project>
export type WorkspaceDocument = RxDocument<Workspace>
export type TaskDocument = RxDocument<Task>

export type Collections = {
	notes: RxCollection<Note>
	tags: RxCollection<Tag>
	projects: RxCollection<Project>
	workspaces: RxCollection<Workspace>
	tasks: RxCollection<Task>
}
