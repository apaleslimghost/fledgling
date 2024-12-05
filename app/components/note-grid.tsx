import { Prisma } from '@prisma/client'
import {Grid} from '@radix-ui/themes'
import NoteCard from './note'
import { PropsWithChildren } from 'react'

export default function NoteGrid({ notes, children }: PropsWithChildren<{ notes: Prisma.NoteGetPayload<{include: {tags: true}}>[] }>) {
	return <Grid flexGrow='1' columns='repeat(auto-fill, minmax(20em, 1fr))' gap='3'>
    {notes.map(note => <NoteCard note={note} key={note.id} />)}

	{children}
  </Grid>
}
