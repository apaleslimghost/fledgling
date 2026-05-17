import {
	BarsAscendingAlignLeftArrowDown,
	Circles3Plus,
	FileText,
	Funnel,
	LayoutColumns3,
	LayoutHeaderCells,
	ListUl,
	Rectangles4,
	Sliders,
	Xmark,
} from '@gravity-ui/icons'
import {
	Button,
	ButtonGroup,
	Card,
	cn,
	Dropdown,
	EmptyState,
	Input,
	Tabs,
	ToggleButton,
	Toolbar,
} from '@heroui/react'
import React, { type ReactElement, useState } from 'react'
import type { Note, View, ViewDocument } from '~/lib/rx-types'
import database from '~/lib/rxdb'
import Link from './link'
import NoteCard from './note-card'

type ViewComponent = React.FC<{ notes: Note[]; inEditor?: boolean }>

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

const GridView: ViewComponent = ({ notes, inEditor }) => (
	<div className="grid auto-fill-[16rem] gap-4">
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

const insertView = (onAddView: (view: ViewDocument) => void) => async () => {
	const view = await database.collections.views.insert({
		id: crypto.randomUUID(),
		type: 'list',
		name: '',
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
	table: ListView,
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
						<ViewType notes={notes} inEditor={inEditor} />
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
