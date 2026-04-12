import {
	At,
	CopyCheckXmark,
	FontCursor,
	Hashtag,
	Plus,
	SquareDashedText,
	TrashBin,
} from '@gravity-ui/icons'
import { Breadcrumbs, Button, Chip, Input, type Key, ListBox, Select, Table } from '@heroui/react'
import { type ElementType, useMemo, useState } from 'react'
import { redirect } from 'react-router'
import { type UseRxQueryOptions, useLiveRxQuery, useRxQuery } from 'rxdb/plugins/react'
import Link from '~/components/link'
import NoteGrid from '~/components/note-grid'
import type { Note, Property, Tag } from '~/lib/rx-types'
import database from '~/lib/rxdb'
import type { Route } from './+types/tag'

export async function clientLoader({ params }: Route.LoaderArgs) {
	const path = params['*']
	if (!path) {
		return redirect('/tags')
	}

	if (path.endsWith('/')) {
		return redirect(`/tag/${path.slice(0, -1)}`)
	}
}

const types: {
	type: Property['type']
	name: string
	icon: ElementType
}[] = [
	{ type: 'text', name: 'Text', icon: SquareDashedText },
	{ type: 'number', name: 'Number', icon: FontCursor },
	{ type: 'boolean', name: 'Boolean', icon: CopyCheckXmark },
	{ type: 'tag', name: 'Tag', icon: Hashtag },
	{ type: 'note', name: 'Note', icon: At },
]

export default function TagPage({ params }: Route.ComponentProps) {
	const path = params['*']

	const notesQuery: UseRxQueryOptions<Note> = useMemo(
		() => ({
			collection: database.notes,
			query: {
				selector: {
					tags: {
						$regex: new RegExp(`^${path}`).source,
					},
				},
			},
		}),
		[path],
	)

	const tagQuery: UseRxQueryOptions<Tag> = useMemo(
		() => ({
			collection: database.tags,
			query: {
				selector: {
					path,
				},
			},
		}),
		[path],
	)

	const {
		results: [tag],
	} = useLiveRxQuery(tagQuery)

	console.log(tag)

	// biome-ignore lint/correctness/useExhaustiveDependencies: array key list
	const propertiesQuery: UseRxQueryOptions<Property> = useMemo(
		() => ({
			collection: database.properties,
			query: {
				selector: {
					id: {
						$in: tag?.properties ?? [],
					},
				},
			},
		}),
		[tag?.properties.join(',')],
	)

	const { results: notes } = useLiveRxQuery(notesQuery)
	const { results: properties } = useLiveRxQuery(propertiesQuery)

	const [newPropertyName, setNewPropertyName] = useState('')
	const [newPropertyType, setNewPropertyType] = useState<Key | null>(0)

	const tagParts = path.split('/')

	return (
		<div className="h-full flex flex-col">
			<header>
				{tagParts.length > 1 && (
					<Breadcrumbs className="mb-4">
						{tagParts.map((part, index) => (
							<Breadcrumbs.Item key={tagParts.slice(0, index + 1).join('/')}>
								{index === tagParts.length - 1 ? (
									part
								) : (
									<Link to={`/tag/${tagParts.slice(0, index + 1).join('/')}`}>
										{index === 0 ? '#' : ''}
										{part}
									</Link>
								)}
							</Breadcrumbs.Item>
						))}
					</Breadcrumbs>
				)}

				<h1 className="text-4xl font-bold mb-6">
					{tagParts.length === 1 ? '#' : ''}
					{tagParts[tagParts.length - 1]}
				</h1>

				<Table variant="secondary">
					<Table.Content>
						<Table.Header>
							<Table.Column isRowHeader>Property</Table.Column>
							<Table.Column>Type</Table.Column>
							<Table.Column />
						</Table.Header>
						<Table.Body>
							{properties.map((property) => {
								const type = types.find((t) => t.type === property.type)!
								return (
									<Table.Row key={property.id}>
										<Table.Cell>{property.name}</Table.Cell>
										<Table.Cell>
											<Chip variant="secondary">
												<type.icon />
												{type.name}
											</Chip>
										</Table.Cell>
										<Table.Cell>
											<Button
												isIconOnly
												variant="danger-soft"
												onClick={async () => {
													await tag?.modify((tag) => {
														tag.properties = tag.properties.filter((p) => p !== property.id)
														return tag
													})

													await property.remove()
												}}
											>
												<TrashBin />
											</Button>
										</Table.Cell>
									</Table.Row>
								)
							})}
							<Table.Row>
								<Table.Cell>
									<Input
										placeholder="Name..."
										aria-label="Property name"
										value={newPropertyName}
										onChange={(e) => setNewPropertyName(e.target.value)}
									/>
								</Table.Cell>
								<Table.Cell>
									<Select value={newPropertyType} onChange={setNewPropertyType}>
										<Select.Trigger>
											<Select.Value />
											<Select.Indicator />
										</Select.Trigger>
										<Select.Popover>
											<ListBox>
												{types.map((type, index) => (
													<ListBox.Item key={type.type} textValue={type.type} id={index}>
														<type.icon />
														{type.name}
														<ListBox.ItemIndicator />
													</ListBox.Item>
												))}
											</ListBox>
										</Select.Popover>
									</Select>
								</Table.Cell>
								<Table.Cell>
									<Button
										isIconOnly
										variant="tertiary"
										onClick={async () => {
											if (!newPropertyName || !(typeof newPropertyType === 'number')) return

											const propertyId = crypto.randomUUID()

											await database.properties.insert({
												id: propertyId,
												name: newPropertyName,
												type: types[newPropertyType]!.type,
											})

											await tag?.modify((tag) => {
												tag.properties = Array.from(new Set([...tag.properties, propertyId]))
												return tag
											})

											setNewPropertyName('')
											setNewPropertyType(null)
										}}
									>
										<Plus />
									</Button>
								</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table.Content>
				</Table>
			</header>

			<NoteGrid notes={notes} className="grow" />
		</div>
	)
}
