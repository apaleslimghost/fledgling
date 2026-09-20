import { schema as s } from "jazz-tools";

const schema = {
	notes: s.table({
		title: s.string(),
		content: s.json(),
		tagIds: s.array(s.ref('tags')),
		taskIds: s.array(s.ref('tasks')),
		projectIds: s.array(s.ref('projects')),
	}),
	tags: s.table({
		path: s.string()
	}),
	projects: s.table({
		title: s.string(),
		tagIds: s.array(s.ref('tags'))
	}),
	tasks: s.table({
		title: s.string(),
		completed: s.boolean(),
		dueDate: s.timestamp(),
	})
};

type AppSchema = s.Schema<typeof schema>;
export const app: s.App<AppSchema> = s.defineApp(schema);

export type Note = s.RowOf<typeof app.notes>;
export type NoteQueryBuilder = typeof app.notes;

export type Tag = s.RowOf<typeof app.tags>;
export type TagQueryBuilder = typeof app.tags;

export type Project = s.RowOf<typeof app.projects>;
export type ProjectQueryBuilder = typeof app.projects;

export type Task = s.RowOf<typeof app.tasks>;
export type TaskQueryBuilder = typeof app.tasks;
