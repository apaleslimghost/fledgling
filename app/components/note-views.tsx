import {
	BarsAscendingAlignLeftArrowDown,
	Circles3Plus,
	FileText,
	Hashtag,
	LayoutColumns3,
	LayoutHeaderCells,
	ListUl,
	Rectangles4,
	Shapes4,
	Sliders,
	SquareDashedLetterT,
	Xmark,
} from '@gravity-ui/icons'
import {
	Button,
	ButtonGroup,
	Card,
	Chip,
	cn,
	Dropdown,
	EmptyState,
	Header,
	Input,
	Separator,
	Tabs,
	ToggleButton,
	Toolbar,
	tableVariants,
} from '@heroui/react'
import React, { type ReactElement, useMemo, useState } from 'react'
import { type UseRxQueryOptions, useLiveRxQuery } from 'rxdb/plugins/react'
import type { Note, Property, Tag, View, ViewDocument } from '~/lib/rx-types'
import database from '~/lib/rxdb'
import Link from './link'
import NoteCard from './note-card'
import { propertyTypes } from './properties'

type ViewComponent = React.FC<{
	notes: Note[]
	view?: View
	inEditor?: boolean
}>

export const ListView: ViewComponent = ({ notes, view }) =>
	notes.length === 0 ? (
		<EmptyState />
	) : (
		<ul>
			{notes.map((note) => (
				<li key={note.id} className="flex gap-1 my-1">
					<Link to={`/note/${note.id}`}>
						<FileText className="mr-1" />
						{note.title}
					</Link>

					{view?.display && view.display.length > 0 && (
						<div className="ml-auto text-sm flex gap-1">
							{view.display.map((field, index) => {
								const value =
									field === 'tags' ? (
										<Chip key="tags">TODO tags</Chip>
									) : (
										note.propertyValues?.[field]
									)
								return (
									<>
										{value}
										{value && index !== view.display.length - 1 && (
											<Separator orientation="vertical" />
										)}
									</>
								)
							})}
						</div>
					)}
				</li>
			))}
		</ul>
	)

const GridView: ViewComponent = ({ notes, inEditor }) => (
	<div className="grid auto-fit-[16rem] gap-4">
		{notes.length === 0 && (
			<Card className={inEditor ? 'border shadow-xs' : undefined}>
				<EmptyState />
			</Card>
		)}

		{notes.map((note) => (
			<NoteCard note={note} key={note.id} className={inEditor ? 'border shadow-xs' : undefined} />
		))}
	</div>
)

const table = tableVariants({ variant: 'secondary' })

const PropertyHeader = ({ field }: { field: string }) => {
	const propertyQuery: UseRxQueryOptions<Property> = useMemo(
		() => ({
			collection: database.properties,
			query: {
				selector: {
					id: field,
				},
			},
		}),
		[field],
	)
	const {
		results: [property],
	} = useLiveRxQuery(propertyQuery)
	const type = propertyTypes.find((t) => t.type === property?.type)

	return (
		<th key={field} className={table.column()}>
			{field === 'title' ? (
				'Title'
			) : field === 'tags' ? (
				<span className="flex gap-1">
					<Hashtag />
					Tags
				</span>
			) : field === 'content' ? (
				<span className="flex gap-1">
					<FileText />
					Content
				</span>
			) : property ? (
				<span className="flex gap-1">
					{type && <type.icon />}
					{property.name}
				</span>
			) : null}
		</th>
	)
}

const PropertyCell = ({ field, note }: { field: string; note: Note }) => {
	return (
		<td className={table.cell()}>
			{field === 'title' ? (
				<Link to={`/note/${note.id}`}>
					<FileText className="mr-1" />
					{note.title}
				</Link>
			) : field === 'tags' ? (
				<>TODO tags</>
			) : field === 'content' ? (
				<>TODO content</>
			) : note.propertyValues && field in note.propertyValues ? (
				note.propertyValues[field]
			) : (
				<EmptyState className="p-0 italic">No value</EmptyState>
			)}
		</td>
	)
}

const TableView: ViewComponent = ({ notes, view }) => {
	return (
		<div className={table.base({ class: 'my-4' })}>
			<table className={table.content()}>
				<thead className={table.header()}>
					<tr>
						<PropertyHeader field="title" />
						{view?.display?.map((field) => (
							<PropertyHeader field={field} key={field} />
						))}
					</tr>
				</thead>
				<tbody className={table.body()}>
					{notes.map((note) => (
						<tr key={note.id} className={table.row()}>
							<PropertyCell field="title" note={note} />
							{view?.display?.map((field) => (
								<PropertyCell field={field} note={note} key={field} />
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

const insertView = (onAddView: (view: ViewDocument) => void) => async () => {
	const view = await database.collections.views.insert({
		id: crypto.randomUUID(),
		type: 'list',
		name: '',
		display: [],
	})

	onAddView(view)
}

const ViewControls = ({
	controls,
	className,
	inEditor,
	onAddView,
	onToggleSettings,
	settingsShown,
}: {
	controls?: ReactElement
	className?: string
	inEditor?: boolean
	settingsShown?: boolean
	onAddView: (view: View) => void
	onToggleSettings: (state: boolean) => void
}) => (
	<div className={`flex gap-2 ${inEditor ? 'flex-col' : 'flex-row'} ${className}`}>
		{controls && (
			<ButtonGroup orientation={inEditor ? 'vertical' : 'horizontal'}>{controls}</ButtonGroup>
		)}

		<ButtonGroup orientation={inEditor ? 'vertical' : 'horizontal'}>
			<ToggleButton
				className={cn('button', inEditor ? 'toggle-button--xs' : 'toggle-button--sm')}
				isIconOnly
				onChange={onToggleSettings}
				isSelected={settingsShown}
			>
				<Sliders />
			</ToggleButton>

			{!inEditor && (
				<Button
					className={cn('button', inEditor ? 'button--xs' : 'button--sm')}
					variant="tertiary"
					onClick={insertView(onAddView)}
				>
					<Circles3Plus />
				</Button>
			)}
		</ButtonGroup>
	</div>
)

const viewTypeLabels: Record<View['type'], React.FC<{ iconOnly?: boolean; className?: string }>> = {
	list: ({ iconOnly, className }) => (
		<>
			<ListUl className={className} />
			{!iconOnly && ' List'}
		</>
	),
	grid: ({ iconOnly, className }) => (
		<>
			<Rectangles4 className={className} />
			{!iconOnly && ' Grid'}
		</>
	),
	table: ({ iconOnly, className }) => (
		<>
			<LayoutHeaderCells className={className} />
			{!iconOnly && ' Table'}
		</>
	),
	board: ({ iconOnly, className }) => (
		<>
			<LayoutColumns3 className={className} />
			{!iconOnly && ' Board'}
		</>
	),
}

const ViewSettings = ({ view, inEditor }: { view: ViewDocument; inEditor?: boolean }) => {
	const [name, setName] = useState(view.name)
	const [type, setType] = useState(view.type)
	const [display, setDisplay] = useState(new Set(['title', ...view.display]))

	// TODO only query properties that notes actually have
	const propertyQuery: UseRxQueryOptions<Property> = useMemo(
		() => ({
			collection: database.properties,
			query: {
				selector: {},
				sort: [{ name: 'asc' }],
			},
		}),
		[],
	)

	const { results: properties } = useLiveRxQuery(propertyQuery)

	const TypeLabelComponent = viewTypeLabels[type]

	return (
		<Toolbar isAttached className="shadow-sm mb-4">
			{!inEditor && (
				<Input
					className="rounded-full"
					variant="secondary"
					value={name}
					onChange={(event) => {
						setName(event.target.value)
					}}
					onBlur={() => {
						view.patch({ name })
					}}
					placeholder="Untitled view"
				/>
			)}
			<ButtonGroup>
				<Dropdown>
					<Button variant="ghost" size={inEditor ? 'sm' : 'md'}>
						<TypeLabelComponent />
					</Button>
					<Dropdown.Popover>
						<Dropdown.Menu
							onAction={(key) => {
								const type = key as View['type']
								setType(type)
								view.patch({ type })
							}}
							selectedKeys={new Set([type])}
						>
							{(Object.keys(viewTypeLabels) as View['type'][]).map((type) => {
								const TypeLabel = viewTypeLabels[type]
								return (
									<Dropdown.Item id={type} key={type}>
										<TypeLabel />
										<Dropdown.ItemIndicator />
									</Dropdown.Item>
								)
							})}
						</Dropdown.Menu>
					</Dropdown.Popover>
				</Dropdown>

				<Dropdown>
					<Button variant="ghost" size={inEditor ? 'sm' : 'md'}>
						<Shapes4 />
						Display
					</Button>
					<Dropdown.Popover>
						<Dropdown.Menu
							selectionMode="multiple"
							selectedKeys={display}
							onAction={(key) => {
								const property = key as string
								if (display.has(property)) {
									display.delete(property)
								} else {
									display.add(property)
								}

								setDisplay(new Set(display))
								view.patch({
									display: [...display].slice(1),
								})
							}}
						>
							<Dropdown.Item isDisabled id="title">
								<SquareDashedLetterT />
								Title
								<Dropdown.ItemIndicator />
							</Dropdown.Item>
							<Dropdown.Item id="tags">
								<Hashtag />
								Tags
								<Dropdown.ItemIndicator />
							</Dropdown.Item>
							<Dropdown.Item id="content">
								<FileText />
								Content
								<Dropdown.ItemIndicator />
							</Dropdown.Item>

							{properties.length > 0 && (
								<Dropdown.Section>
									<Header>Properties</Header>

									{properties.map((property) => {
										const type = propertyTypes.find((t) => t.type === property.type)!
										return (
											<Dropdown.Item key={property.id} id={property.id}>
												<type.icon />
												{property.name}
												<Dropdown.ItemIndicator />
											</Dropdown.Item>
										)
									})}
								</Dropdown.Section>
							)}
						</Dropdown.Menu>
					</Dropdown.Popover>
				</Dropdown>

				<Dropdown>
					<Button variant="ghost" size={inEditor ? 'sm' : 'md'}>
						<BarsAscendingAlignLeftArrowDown />
						Sort
					</Button>
					<Dropdown.Popover>
						<Dropdown.Menu>
							<Dropdown.Item>TODO</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown.Popover>
				</Dropdown>
			</ButtonGroup>
		</Toolbar>
	)
}

const viewTypes: Record<View['type'], ViewComponent> = {
	list: ListView,
	grid: GridView,
	table: TableView,
	board: ListView,
}

export default function NoteViews({
	notes,
	views,
	controls,
	className,
	inEditor,
	onAddView,
	onRemoveView,
}: {
	notes: Note[]
	views: ViewDocument[]
	controls?: ReactElement
	className?: string
	inEditor?: boolean
	onAddView: (view: View) => void
	onRemoveView: (view: View) => void
}) {
	const [showSettings, setShowSettings] = useState(false)

	return views.length > 0 ? (
		inEditor ? (
			views.map((view) => {
				const ViewType = viewTypes[view.type]
				return (
					<React.Fragment key={view.id}>
						<ViewControls
							controls={controls}
							onAddView={onAddView}
							inEditor={inEditor}
							settingsShown={showSettings}
							onToggleSettings={setShowSettings}
							className="float-start -ml-9.25 bg-white pb-2"
						/>

						{showSettings && <ViewSettings view={view} inEditor={inEditor} />}
						<ViewType notes={notes} inEditor={inEditor} view={view} />
					</React.Fragment>
				)
			})
		) : (
			<Tabs className={className} variant="secondary">
				<Tabs.ListContainer
					render={({ children, ...props }) => (
						<div {...props} className={`flex gap-4 ${props.className}`}>
							{children}

							<ViewControls
								controls={controls}
								inEditor={inEditor}
								settingsShown={showSettings}
								onAddView={onAddView}
								onToggleSettings={setShowSettings}
							/>
						</div>
					)}
				>
					<Tabs.List>
						{views.map((view) => {
							const TypeIcon = viewTypeLabels[view.type]
							return (
								<Tabs.Tab key={view.id} id={view.id} className="flex">
									<TypeIcon iconOnly className="mr-1" />
									{view.name || 'Untitled view'}
									<ToggleButton
										isIconOnly
										size="sm"
										variant="ghost"
										className="ml-auto"
										onClick={async () => {
											await view.remove()
											onRemoveView(view)
											setShowSettings(false)
										}}
									>
										<Xmark />
									</ToggleButton>
									<Tabs.Indicator />
								</Tabs.Tab>
							)
						})}
					</Tabs.List>
				</Tabs.ListContainer>

				{views.map((view) => {
					const ViewType = viewTypes[view.type]
					return (
						<Tabs.Panel key={view.id} id={view.id}>
							{showSettings && <ViewSettings view={view} inEditor={inEditor} />}
							<ViewType notes={notes} inEditor={inEditor} />
						</Tabs.Panel>
					)
				})}
			</Tabs>
		)
	) : (
		<>
			<Toolbar className="shadow-sm mb-4" isAttached>
				<ViewControls
					controls={controls}
					onAddView={onAddView}
					inEditor={inEditor}
					settingsShown={showSettings}
					onToggleSettings={async (show) => {
						if (show) {
							await insertView(onAddView)()
						}

						setShowSettings(show)
					}}
				/>
			</Toolbar>
			<ListView notes={notes} />
		</>
	)
}
