import { FilePlusIcon } from '@radix-ui/react-icons'
import { Box, Button, ScrollArea, Theme } from '@radix-ui/themes'
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
		<Theme appearance="dark" style={{ height: '100%' }}>
			<Box flexBasis="16em" p="3" style={{ height: '100%' }}>
				<ScrollArea scrollbars="vertical" type="hover">
					<Form method="post">
						<Button>
							<FilePlusIcon />
							Create
						</Button>
					</Form>

					{tags && <TagTree tags={tagsWithNotes} />}
				</ScrollArea>
			</Box>
		</Theme>
	)
}
