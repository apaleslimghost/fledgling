import {
	BarsAscendingAlignLeftArrowDown,
	Circles3Plus,
	Circles4Square,
	FileText,
	Funnel,
	Gear,
	LayoutCells,
	LayoutColumns3,
	LayoutHeaderCells,
	ListUl,
	Plus,
	Rectangles4,
	Xmark,
} from '@gravity-ui/icons'
import {
	Button,
	ButtonGroup,
	Dropdown,
	EmptyState,
	Header,
	Input,
	Tabs,
	ToggleButton,
	Toolbar,
} from '@heroui/react'
import { Component, type ReactElement, useState } from 'react'
import type { Note, View } from '~/lib/rx-types'
import database from '~/lib/rxdb'
import Link from './link'

type ViewComponent = React.FC<{ notes: Note[] }>

export const ListView: ViewComponent = ({ notes }) =>
	notes.length === 0 ? (
		<EmptyState />
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
	)

const ViewControls = ({
	controls,
	className,
	onAddView,
	onToggleSettings,
}: {
	controls?: ReactElement
	className?: string
	onAddView: (view: View) => void
	onToggleSettings?: (state: boolean) => void
}) => (
	<div className={`flex gap-2 ${className}`}>
		<ButtonGroup>
			{onToggleSettings && (
				<ToggleButton className="button" isIconOnly size="sm" onChange={onToggleSettings}>
					<Gear />
				</ToggleButton>
			)}

			<Button
				isIconOnly={!!onToggleSettings}
				size="sm"
				variant="tertiary"
				onClick={async () => {
					const view = await database.collections.views.insert({
						id: crypto.randomUUID(),
						type: 'list',
						name: '',
					})

					onAddView(view)
				}}
			>
				<Circles3Plus />
				{!onToggleSettings && 'Add view'}
			</Button>
		</ButtonGroup>

		{controls && <ButtonGroup>{controls}</ButtonGroup>}
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

const ViewSettings = ({ view }: { view: View }) => {
	const [name, setName] = useState(view.name)
	const [type, setType] = useState(view.type)
	const TypeLabelComponent = viewTypeLabels[type]
	return (
		<Toolbar isAttached className="shadow-sm mb-4">
			<Input
				className="rounded-full"
				variant="secondary"
				value={name}
				onChange={(event) => {
					setName(event.target.value)
				}}
				onBlur={() => {
					database.collections.views.findOne({ selector: { id: view.id } }).patch({ name })
				}}
				placeholder="Untitled view"
			/>
			<ButtonGroup>
				<Dropdown>
					<Button variant="ghost">
						<TypeLabelComponent />
					</Button>
					<Dropdown.Popover>
						<Dropdown.Menu
							onAction={(key) => {
								const type = key as View['type']
								setType(type)
								database.collections.views.findOne({ selector: { id: view.id } }).patch({ type })
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
					<Button variant="ghost">
						<Funnel />
						Filter
					</Button>
					<Dropdown.Popover>
						<Dropdown.Menu>
							<Dropdown.Item>TODO</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown.Popover>
				</Dropdown>

				<Dropdown>
					<Button variant="ghost">
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
	grid: ListView,
	table: ListView,
	board: ListView,
}

export default function NoteViews({
	notes,
	views,
	controls,
	className,
	onAddView,
	onRemoveView,
}: {
	notes: Note[]
	views: View[]
	controls?: ReactElement
	className?: string
	onAddView: (view: View) => void
	onRemoveView: (view: View) => void
}) {
	const [showSettings, setShowSettings] = useState(false)

	return views.length > 0 ? (
		<Tabs className={className} variant="secondary">
			<Tabs.ListContainer
				render={({ children, ...props }) => (
					<div {...props} className={`flex gap-4 ${props.className}`}>
						{children}

						<ViewControls
							controls={controls}
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
										await database.collections.views
											.findOne({
												selector: {
													id: view.id,
												},
											})
											.remove()

										onRemoveView(view)
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
						{showSettings && <ViewSettings view={view} />}
						<ViewType notes={notes} />
					</Tabs.Panel>
				)
			})}
		</Tabs>
	) : (
		<>
			<ViewControls controls={controls} onAddView={onAddView} className="float-end" />
			<ListView notes={notes} />
		</>
	)
}
