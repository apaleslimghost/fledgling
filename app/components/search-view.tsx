import { Check, DatabaseMagnifier, FileText, Minus, Plus, TrashBin, Xmark } from '@gravity-ui/icons'
import {
	Autocomplete,
	autocompleteVariants,
	Button,
	ButtonGroup,
	Chip,
	EmptyState,
	Input,
	Label,
	ListBox,
	SearchField,
	Select,
	Surface,
	TextField,
	useFilter,
} from '@heroui/react'
import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react'
import { useMemo, useState } from 'react'
import type { MangoQuerySelector } from 'rxdb'
import { useLiveRxQuery } from 'rxdb/plugins/react'
import type { Note, Tag as TagRecord } from '~/lib/rx-types'
import Link from './link'

type Field = 'title' | 'text' | 'tags'
type Operator = 'eq' | 'ne' | 'contains' | 'notContains' | 'startsWith' | 'notStartsWith'

interface QueryRow {
	field: Field
	operator: Operator
	value: string
}

const FIELDS: { id: Field; label: string }[] = [
	{ id: 'title', label: 'Title' },
	{ id: 'text', label: 'Text' },
	{ id: 'tags', label: 'Tags' },
]

const operators: Record<Field, { id: Operator; label: string }[]> = {
	title: [
		{ id: 'eq', label: 'equals' },
		{ id: 'ne', label: 'does not equal' },
		{ id: 'contains', label: 'contains' },
		{ id: 'notContains', label: 'does not contain' },
	],
	text: [
		{ id: 'contains', label: 'contains' },
		{ id: 'notContains', label: 'does not contain' },
	],
	tags: [
		{ id: 'contains', label: 'contains' },
		{ id: 'startsWith', label: 'contains (with descendants)' },
		{ id: 'notStartsWith', label: 'does not contain (with descendants)' },
	],
}

function buildClause(row: QueryRow): MangoQuerySelector<Note> | null {
	switch (row.operator) {
		case 'eq':
			return { [row.field]: { $eq: row.value } }
		case 'ne':
			return { [row.field]: { $ne: row.value } }
		case 'contains':
			if (row.field === 'tags') {
				return { [row.field]: { $eq: row.value } }
			}
			return { [row.field]: { $regex: row.value, $options: 'i' } }
		case 'notContains':
			return { [row.field]: { $not: { $regex: row.value, $options: 'i' } } }
		case 'startsWith':
			return { [row.field]: { $regex: `^${row.value}` } }
		case 'notStartsWith':
			return { [row.field]: { $not: { $regex: `^${row.value}` } } }
		default:
			return null
	}
}

function buildSelector(rows: QueryRow[]): MangoQuerySelector<Note> {
	const clauses = rows.map(buildClause).filter((c) => c !== null)

	switch (clauses.length) {
		case 0:
			return {}
		case 1:
			return clauses[0] ?? {}
		default:
			return { $and: clauses }
	}
}

const tagQuery = { collection: 'tags', query: {} }

type TagAutocompleteProps = {
	value: string
	onChange: (value: string) => void
}

const FakeDivButtonSorryReactAria = 'div' as 'button'

function TagAutocomplete({ value, onChange }: TagAutocompleteProps) {
	const { results: tags } = useLiveRxQuery<TagRecord>(tagQuery)
	const [searchTerm, setSearchTerm] = useState('')
	const { contains } = useFilter({ sensitivity: 'base' })

	const items = Array.from(new Set([searchTerm, value, ...tags.map((tag) => tag.path)])).filter(
		Boolean,
	)

	// bro idek what's going on with autocomplete, using the select
	// wrapper components with an autocomplete filter seems to work
	return (
		<Select
			className="flex-1"
			placeholder="tags…"
			variant="secondary"
			value={value}
			onChange={(keys) => onChange(String(keys))}
		>
			<Label className="sr-only">Tags</Label>
			<Select.Trigger render={(props) => <FakeDivButtonSorryReactAria {...props} />}>
				<Select.Value>
					{({ defaultChildren, isPlaceholder, state }) => {
						if (isPlaceholder || state.selectedItems.length === 0) return defaultChildren
						return (
							<Chip variant="soft" color="accent">
								#{state.selectedItems[0]?.textValue}
							</Chip>
						)
					}}
				</Select.Value>
				<Select.Indicator />
			</Select.Trigger>
			<Select.Popover className={autocompleteVariants().popover()}>
				<Autocomplete.Filter
					filter={contains}
					inputValue={searchTerm}
					onInputChange={setSearchTerm}
				>
					<SearchField autoFocus>
						<SearchField.Group>
							<SearchField.SearchIcon />
							<SearchField.Input placeholder="Search tags…" />
							<SearchField.ClearButton />
						</SearchField.Group>
					</SearchField>
					<ListBox>
						{items.map((item) => (
							<ListBox.Item key={item} id={item} textValue={item}>
								<Chip color="accent" variant="soft">
									#{item}
								</Chip>
								<ListBox.ItemIndicator />
							</ListBox.Item>
						))}
					</ListBox>
				</Autocomplete.Filter>
			</Select.Popover>
		</Select>
	)
}

export default function SearchView(props: ReactNodeViewProps) {
	const [rows, setRows] = useState<QueryRow[]>(
		props.node.attrs.query ?? [{ id: 0, field: 'title', operator: 'eq', value: '' }],
	)

	const selector = useMemo(() => buildSelector(rows), [rows])
	const query = useMemo(
		() => ({
			collection: 'notes',
			query: {
				selector,
			},
		}),
		[selector],
	)

	// TODO why does this keep switching back to the previous results?
	const { results: notes } = useLiveRxQuery<Note>(query)

	function updateRow(index: number, updates: Partial<QueryRow>) {
		setRows((prev) => prev.map((row, i) => (index === i ? { ...row, ...updates } : row)))
	}

	function handleFieldChange(index: number, field: Field) {
		const [firstOp] = operators[field]
		const firstOperator = firstOp?.id ?? 'contains'
		updateRow(index, { field, operator: firstOperator, value: '' })
	}

	function addRow() {
		setRows((prev) => [...prev, { field: 'title', operator: 'eq', value: '' }])
	}

	function removeRow(index: number) {
		setRows((prev) => prev.toSpliced(index, 1))
	}

	return (
		<NodeViewWrapper>
			<Surface
				variant="transparent"
				className="p-4 rounded-xl border not-prose"
				contentEditable={false}
			>
				{props.node.attrs.confirmed ? (
					<>
						<Button
							className="float-end"
							variant="ghost"
							isIconOnly
							onClick={() => props.updateAttributes({ confirmed: false })}
						>
							<DatabaseMagnifier />
						</Button>
						{notes.length === 0 ? (
							<EmptyState></EmptyState>
						) : (
							<ul>
								{notes.map((note) => (
									<li key={note.id}>
										<Link to={`/note/${note.id}`}>
											<FileText className="mr-1" />
											{note.title}
										</Link>
									</li>
								))}
							</ul>
						)}
					</>
				) : (
					<div className="flex flex-col gap-3">
						{rows.map((row, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: oh, hush
							<div key={index} className="flex gap-2 items-center">
								<Select
									className="w-28"
									value={row.field}
									variant="secondary"
									onChange={(value) => handleFieldChange(index, value as Field)}
								>
									<Label className="sr-only">Field</Label>
									<Select.Trigger>
										<Select.Value />
										<Select.Indicator />
									</Select.Trigger>
									<Select.Popover>
										<ListBox>
											{FIELDS.map((f) => (
												<ListBox.Item key={f.id} id={f.id} textValue={f.label}>
													{f.label}
													<ListBox.ItemIndicator />
												</ListBox.Item>
											))}
										</ListBox>
									</Select.Popover>
								</Select>

								<Select
									className="w-60"
									value={row.operator}
									variant="secondary"
									onChange={(value) => updateRow(index, { operator: value as Operator })}
								>
									<Label className="sr-only">Operator</Label>
									<Select.Trigger>
										<Select.Value />
										<Select.Indicator />
									</Select.Trigger>
									<Select.Popover>
										<ListBox>
											{operators[row.field].map((op) => (
												<ListBox.Item key={op.id} id={op.id} textValue={op.label}>
													{op.label}
													<ListBox.ItemIndicator />
												</ListBox.Item>
											))}
										</ListBox>
									</Select.Popover>
								</Select>

								{row.field === 'tags' ? (
									<TagAutocomplete
										value={row.value}
										onChange={(value) => updateRow(index, { value })}
									/>
								) : (
									<TextField
										className="flex-1"
										variant="secondary"
										value={Array.isArray(row.value) ? '' : row.value}
										onChange={(value) => updateRow(index, { value })}
									>
										<Label className="sr-only">Value</Label>
										<Input placeholder="value…" />
									</TextField>
								)}

								{rows.length > 1 && (
									<Button
										isIconOnly
										variant="ghost"
										size="sm"
										onPress={() => removeRow(index)}
										aria-label="Remove condition"
									>
										<Minus />
									</Button>
								)}
							</div>
						))}

						<div className="flex gap-2 items-center">
							<Button variant="ghost" size="sm" onPress={addRow} className="self-start mr-auto">
								<Plus />
								Add condition
							</Button>

							{Object.keys(selector).length > 0 && (
								<Chip variant="secondary">
									{notes.length} result{notes.length !== 1 ? 's' : ''}
								</Chip>
							)}

							<Button variant="danger-soft" size="sm" onPress={props.deleteNode}>
								<TrashBin />
							</Button>
							<ButtonGroup>
								<Button
									variant="tertiary"
									size="sm"
									onPress={() => {
										props.updateAttributes({ confirmed: true })
									}}
								>
									<Xmark />
								</Button>

								<Button
									variant="primary"
									size="sm"
									isDisabled={Object.keys(selector).length === 0}
									onPress={() => {
										props.updateAttributes({ confirmed: true, query: rows })
									}}
								>
									<Check />
								</Button>
							</ButtonGroup>
						</div>
					</div>
				)}
			</Surface>
		</NodeViewWrapper>
	)
}
