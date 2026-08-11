import { schema as s } from "jazz-tools";

const schema = {
	notes: s.table({
		title: s.string(),
		content: s.json()
	}),
};

type AppSchema = s.Schema<typeof schema>;
export const app: s.App<AppSchema> = s.defineApp(schema);

export type Note = s.RowOf<typeof app.notes>;
export type NoteQueryBuilder = typeof app.notes;
