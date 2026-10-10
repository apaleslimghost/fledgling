import type { Note } from "./schema";

export const title = (note: Note) => {
	return note.content?.content?.find(node => node.type === 'title')?.content?.[0]?.text
}
