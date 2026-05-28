import { Card, cn } from '@heroui/react'
import { renderToReactElement } from '@tiptap/static-renderer'
import type { ComponentProps } from 'react'
import type { Note, View } from '~/lib/rx-types'
import { extensions } from './editor/extensions'
import Link from './link'
import { MentionChip, MentionView } from './mention'

const NoteContent = ({ note }: { note: Note }) => {
	const content = {
		...(note.text ?? { type: 'doc' }),
		content: note.text?.content?.slice(1),
	}

	return (
		<article className="prose prose-mauve">
			{renderToReactElement({
				content,
				extensions,
				options: {
					nodeMapping: {
						mention: MentionView,
					},
				},
			})}
		</article>
	)
}

export default function NoteCard({
	note,
	view,
	...cardProps
}: { note: Note; view?: View } & Omit<ComponentProps<typeof Card>, 'children'>) {
	return (
		<Card {...cardProps}>
			<Card.Header>
				<Card.Title>
					<Link to={`/note/${note.id}`}>
						<h1 className={cn('text-2xl font-bold', { 'text-mauve-500': !note.title })}>
							{note.title ?? 'untitled note'}
						</h1>
					</Link>
				</Card.Title>
			</Card.Header>

			<Card.Content>
				<div className="flex flex-col gap-2">
					{view?.display.map((field) => {
						const value =
							field === 'tags'
								? note.tags.map((tag) => (
										<MentionChip
											key={tag}
											href={`/tag/${tag}`}
											char="#"
											label={tag}
											variant="secondary"
										/>
									))
								: note.propertyValues?.[field]

						return value ? (
							<div className="flex flex-wrap gap-1" key={field}>
								{value}
							</div>
						) : null
					})}
				</div>
			</Card.Content>
		</Card>
	)
}
