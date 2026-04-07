import type { PropsWithChildren } from 'react'
import type { Note } from '~/lib/rx-types'
import NoteCard from './note'

export default function NoteGrid({ notes, children }: PropsWithChildren<{ notes: Note[] }>) {
	return (
		<div className="grid grid-cols-[repeat(auto-fill, minmax(20em, 1fr))] gap-1">
			{notes.map((note) => (
				<NoteCard note={note} key={note.id} />
			))}

			{children}
		</div>
	)
}
