import { ScrollShadow } from '@heroui/react'
import type { Note } from '~/lib/rx-types'
import NoteCard from './note-card'

export default function NoteGrid({ notes, className }: { notes: Note[]; className?: string }) {
	return (
		<ScrollShadow className={className}>
			<div className="flex flex-col gap-4">
				{notes.map((note) => (
					<NoteCard note={note} key={note.id} />
				))}
			</div>
		</ScrollShadow>
	)
}
