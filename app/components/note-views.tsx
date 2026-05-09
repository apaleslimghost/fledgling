import { Circles3Plus, FileText, Gear, ListUl, Plus, Xmark } from '@gravity-ui/icons'
import { Button, ButtonGroup, EmptyState, Tabs, ToggleButton, Toolbar } from '@heroui/react'
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
}: {
	controls?: ReactElement
	className?: string
	onAddView: (view: View) => void
}) => (
	<ButtonGroup className={className}>
		<Button
			isIconOnly
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
		</Button>

		{controls}
	</ButtonGroup>
)

const viewTypes: Record<View['type'], ViewComponent> = {
	list: ListView,
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
	return views.length > 0 ? (
		<Tabs className={className} variant="secondary">
			<Tabs.ListContainer
				render={({ children, ...props }) => (
					<div {...props} className={`flex gap-4 ${props.className}`}>
						{children}

						<ViewControls controls={controls} onAddView={onAddView} />
					</div>
				)}
			>
				<Tabs.List>
					{views.map((view) => (
						<Tabs.Tab key={view.id} id={view.id} className="flex">
							<ListUl className="mr-1" />
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
					))}
				</Tabs.List>
			</Tabs.ListContainer>

			{views.map((view) => {
				const ViewType = viewTypes[view.type]
				return (
					<Tabs.Panel key={view.id} id={view.id}>
						<ViewType notes={notes} />
					</Tabs.Panel>
				)
			})}
		</Tabs>
	) : (
		<>
			<ViewControls controls={controls} onAddView={onAddView} />
			<ListView notes={notes} />
		</>
	)
}
