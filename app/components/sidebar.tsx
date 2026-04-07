import { FilePlus } from '@gravity-ui/icons'
import { Button, Surface } from '@heroui/react'
import { Form } from 'react-router'
import { useLiveRxQuery } from 'rxdb/plugins/react'
import TagTree from '~/components/tag-tree'
import type { Note, Tag } from '~/lib/rx-types'

const tagQuery = {
	collection: 'tags',
	query: {},
}

const noteQuery = {
	collection: 'notes',
	query: {},
}

export default function Sidebar() {
	const { results: tags } = useLiveRxQuery<Tag>(tagQuery)
	const { results: notes } = useLiveRxQuery<Note>(noteQuery)

	const tagsWithNotes = tags.map(({ path, ...props }) => ({
		...props,
		path,
		notes: notes.filter((note) => note.tags.includes(path)),
	}))

	return (
		<div className="overflow-y-auto w-1/6">
			<Form method="post" className="mb-2">
				<Button fullWidth variant="outline">
					<FilePlus />
					Create
				</Button>
			</Form>

			{tags && <TagTree tags={tagsWithNotes} />}
		</div>
	)
}
