import type { Note } from './rx-types'

export const getNoteTitle = (note?: Note) =>
	note?.text?.content
		?.find((node) => node.type === 'title')
		?.content?.map((c) => c.text ?? '')
		.join('')
