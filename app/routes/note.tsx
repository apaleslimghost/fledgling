import { Checkbox, Input, NumberField, ScrollShadow, Surface, Table } from '@heroui/react'
import { parseFormData, validationError } from '@rvf/react-router'
import type { MentionNodeAttrs } from '@tiptap/extension-mention'
import type { EditorEvents, JSONContent, Editor as TiptapEditor } from '@tiptap/react'
import debounce from 'lodash/debounce'
import { useMemo, useRef, useState } from 'react'
import { useFetcher } from 'react-router'
import type { RxDocument } from 'rxdb'
import { type UseRxQueryOptions, useLiveRxQuery } from 'rxdb/plugins/react'
import { z } from 'zod/v4'
import Editor from '~/components/editor'
import PageTitle from '~/components/page-title'
import type { Note, NoteDocument, Property } from '~/lib/rx-types'
import database from '~/lib/rxdb'
import type { Route } from './+types/note'

const ActionSchema = z.object({
	text: z.string().transform((text) => JSON.parse(text) as JSONContent),
})

interface MentionNode extends JSONContent {
	type: 'mention'
	attrs: MentionNodeAttrs
}

function isNode<T extends JSONContent>(type: T['type'], obj: unknown): obj is T {
	if (obj && typeof obj === 'object' && 'type' in obj && obj.type === type) {
		return true
	}

	return false
}

function* collect<T extends JSONContent>(type: T['type'], tree: JSONContent): Generator<T> {
	if (isNode<T>(type, tree)) {
		yield tree
	}

	for (const child of tree.content ?? []) {
		yield* collect(type, child)
	}
}

function PropertyValueInput({
	note,
	property,
}: {
	note: NoteDocument
	property: RxDocument<Property>
}) {
	const storedValue = note.propertyValues?.[property.id]
	const [value, setValue] = useState<string | boolean | number>(() => {
		if (property.type === 'boolean') return (storedValue as boolean | undefined) ?? false
		return storedValue !== undefined ? String(storedValue) : ''
	})
	const noteRef = useRef(note)
	noteRef.current = note

	const saveValue = useMemo(
		() =>
			debounce((newValue: string | number | boolean) => {
				noteRef.current.patch({
					propertyValues: {
						...noteRef.current.propertyValues,
						[property.id]: newValue,
					},
				})
			}, 200),
		[property.id],
	)

	if (property.type === 'boolean') {
		return (
			<Checkbox
				isSelected={value as boolean}
				onChange={(checked) => {
					setValue(checked)
					saveValue(checked)
				}}
				onKeyDown={(e) => {
					e.nativeEvent.stopImmediatePropagation()
					e.stopPropagation()
				}}
			>
				<Checkbox.Control>
					<Checkbox.Indicator />
				</Checkbox.Control>
			</Checkbox>
		)
	}

	if (property.type === 'number') {
		return (
			<NumberField
				value={value as number}
				onChange={(value) => {
					setValue(value)
					saveValue(value)
				}}
				name="width"
			>
				<NumberField.Group>
					<NumberField.DecrementButton />
					<NumberField.Input
						onKeyDown={(e) => {
							e.nativeEvent.stopImmediatePropagation()
							e.stopPropagation()
						}}
					/>
					<NumberField.IncrementButton />
				</NumberField.Group>
			</NumberField>
		)
	}

	if (property.type === 'tag' || property.type === 'note') {
		// TODO: implement tag and note property inputs
		return null
	}

	return (
		<Input
			value={value as string}
			onChange={(e) => {
				setValue(e.target.value)
				saveValue(e.target.value)
			}}
			onKeyDown={(e) => {
				e.stopPropagation()
				e.nativeEvent.stopImmediatePropagation()
			}}
		/>
	)
}

export async function clientAction({ request, params }: Route.ClientActionArgs) {
	const result = await parseFormData(request, ActionSchema)

	if (result.error) {
		return validationError(result.error, result.submittedData)
	}

	const tags = Array.from(collect<MentionNode>('mention', result.data.text)).flatMap((tag) =>
		tag.attrs.id && tag.attrs.mentionSuggestionChar === '#' ? [tag.attrs.id] : [],
	)

	const note = await database.notes
		.findOne({
			selector: {
				id: params.id,
			},
		})
		.exec(true)

	await note.patch({
		...result.data,
		tags,
	})

	await Promise.all(
		Array.from(new Set(tags), (tag) =>
			database.tags.insertIfNotExists({ path: tag, properties: [] }),
		),
	)

	const allNotes = await database.notes.find().exec()

	const allTags = Array.from(new Set(allNotes.flatMap((note) => note.tags)))

	await database.tags
		.find({
			selector: {
				path: {
					$nin: allTags,
				},
			},
		})
		.remove()

	return { ok: true }
}

export default function NotePage(props: Route.ComponentProps) {
	const query: UseRxQueryOptions<Note> = useMemo(
		() => ({
			collection: database.notes,
			query: {
				selector: {
					id: props.params.id,
				},
			},
		}),
		[props.params.id],
	)

	const {
		results: [note],
		loading,
	} = useLiveRxQuery(query)

	const tags = Array.from(collect<MentionNode>('mention', note?.text ?? [])).flatMap((tag) =>
		tag.attrs.id && tag.attrs.mentionSuggestionChar === '#' ? [tag.attrs.id] : [],
	)

	const tagsWithAncestors = tags.flatMap((tag) =>
		tag
			.split('/')
			.reduce(
				(ancestors, part) =>
					ancestors.concat(
						ancestors.length === 0 ? part : ancestors[ancestors.length - 1]! + '/' + part,
					),
				[] as string[],
			),
	)

	// biome-ignore lint/correctness/useExhaustiveDependencies: virtual array dependency
	const tagQuery = useMemo(
		() => ({
			collection: database.tags,
			query: {
				selector: {
					$or: tagsWithAncestors.map((tag) => ({ path: tag })),
				},
			},
		}),
		[tagsWithAncestors.join(',')],
	)

	const { results: allTags } = useLiveRxQuery(tagQuery)

	// biome-ignore lint/correctness/useExhaustiveDependencies: virtual array dependency
	const propertiesQuery: UseRxQueryOptions<Property> = useMemo(
		() => ({
			collection: database.properties,
			query: {
				selector: {
					id: {
						$in: allTags.flatMap((tag) => tag.properties),
					},
				},
			},
		}),
		[allTags.flatMap((tag) => tag.properties).join(',')],
	)

	const { results: properties } = useLiveRxQuery(propertiesQuery)

	const fetcher = useFetcher()

	const onTextChange = useMemo(
		() =>
			debounce(({ editor }: EditorEvents['update']) => {
				const formData = new FormData()
				formData.set('text', JSON.stringify(editor.getJSON()))
				fetcher.submit(formData, { method: 'post' })
			}, 200),
		[fetcher],
	)

	const editorRef = useRef<TiptapEditor>(null)

	// TODO: loading is never actually true
	// https://github.com/pubkey/rxdb/pull/8292
	if (loading || !note) {
		return null
	}

	return (
		<>
			<PageTitle title={note?.title ?? 'Untitled note'} />
			<Surface className="rounded-xl shadow-surface p-4 h-full">
				<ScrollShadow className="h-full">
					<h1 className="text-3xl font-bold text-mauve-800">
						<input
							value={note.title ?? ''}
							placeholder="Untitled note"
							className="w-full outline-none"
							autoComplete="none"
							onKeyUp={(e) => {
								if (e.key === 'Enter' || e.key === 'ArrowDown') {
									e.preventDefault()
									editorRef.current?.commands.focus()
								}
							}}
							onChange={(e) => {
								note?.patch({
									title: e.target.value,
								})
							}}
						/>
					</h1>
					{properties.length > 0 && (
						<Table variant="secondary" className="my-4">
							<Table.Content>
								<Table.Header>
									<Table.Column isRowHeader>Property</Table.Column>
									<Table.Column>Value</Table.Column>
								</Table.Header>
								<Table.Body>
									{properties.map((property) => (
										<Table.Row key={property.id}>
											<Table.Cell>{property.name}</Table.Cell>
											<Table.Cell>
												<PropertyValueInput note={note} property={property} />
											</Table.Cell>
										</Table.Row>
									))}
								</Table.Body>
							</Table.Content>
						</Table>
					)}
					<Editor
						id={note.id}
						onUpdate={onTextChange}
						content={note.text ?? undefined}
						ref={editorRef}
					/>
				</ScrollShadow>
			</Surface>
		</>
	)
}
