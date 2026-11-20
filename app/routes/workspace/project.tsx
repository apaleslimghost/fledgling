import type { Node } from '@tiptap/pm/model'
import database from "~/data/rxdb";
import type { Route } from "./+types/project";
import { Link, NavLink } from "react-router";
import Editor from "~/components/editor";
import NoteCard from "~/components/note-card";

import { GridList, GridListItem, type DroppableCollectionDropEvent, type DroppableCollectionInsertDropEvent, type DroppableCollectionRootDropEvent } from 'react-aria-components/GridList';
import { useDragAndDrop, DropIndicator, isTextDropItem } from 'react-aria-components/useDragAndDrop';
import { useListData, type ListData } from 'react-aria-components/useListData';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'react-aria-components/Tabs'
import type { Task } from "~/data/schema";
import { useSetActiveTags, useWorkspace } from "~/data/context";
import { Icon } from "~/components/icon";
import { useMemo } from "react";
import { useRxQuery } from "rxdb/plugins/react";
import { NoteMention } from "~/components/mention";
import Mention from "@tiptap/extension-mention";

const TaskCard = ({ task }: { task: Task }) => {
	return <GridListItem id={task.id} value={task} className='card surface mid'>
		<Editor id={task.id} content={task.content} editable={false} />
		<NoteMention id={task.note} fallbackLabel='Note' />
	</GridListItem>
}

const Board = ({ tasks }: { tasks: Task[] }) => {
	const list = useListData({
		initialItems: tasks
	})

	return <div className="columns">
		<Column status='todo' list={list} />
		<Column status='in-progress' list={list} />
		<Column status='done' list={list} />
	</div>
}

const Column = ({ status, list }: { status: Task['status'], list: ListData<Task> }) => {
	const items = list.items.filter(t => t.status === status);
	const updateTasks = async (e: DroppableCollectionInsertDropEvent | DroppableCollectionRootDropEvent) => {
		const ids = await Promise.all(
			e.items.filter(isTextDropItem).map(item => item.getText('task-id'))
		);

		const tasks = await database.tasks.findByIds(ids).patch({ status })

		for (const [id, task] of tasks) {
			list.update(id, task);
		}

		return ids
	}

	const { dragAndDropHooks } = useDragAndDrop({
		getItems(keys, items: Task[]) {
			return items.map((item) => ({
				'task-id': item.id,
				'application/json': JSON.stringify(item.content)
			}));
		},

		renderDropIndicator(target) {
			return (
				<DropIndicator target={target}>
					<hr />
				</DropIndicator>
			);
		},

		acceptedDragTypes: ['task-id'],

		getDropOperation: () => 'move',

		async onInsert(e) {
			const ids = await updateTasks(e)

			if (e.target.dropPosition === 'before') {
				list.moveBefore(e.target.key, ids);
			} else if (e.target.dropPosition === 'after') {
				list.moveAfter(e.target.key, ids);
			}
		},

		onRootDrop: updateTasks,

		onReorder(e) {
			if (e.target.dropPosition === 'before') {
				list.moveBefore(e.target.key, e.keys);
			} else if (e.target.dropPosition === 'after') {
				list.moveAfter(e.target.key, e.keys);
			}
		}
	});

	return <GridList
		items={items}
		aria-label={status}
		selectionMode="multiple"
		dragAndDropHooks={dragAndDropHooks}
		renderEmptyState={() => 'No tasks.'}
		className='rows'>
		{task => <TaskCard task={task} />}
	</GridList>
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const [project, notes] = await Promise.all([
		database.projects.findOne({ selector: { id: params.projectId } }).exec(true),
		database.notes.find({ selector: { projects: { $elemMatch: { $eq: params.projectId } } } }).exec(),
	])

	const tasks = await database.tasks.find({ selector: { note: { $in: notes.map(note => note.id) } } }).exec()

	return {
		project,
		notes,
		tasks
	}
}

export default function Project({ loaderData: { project, notes, tasks }, params }: Route.ComponentProps) {
	useSetActiveTags(true, [])

	return <div>
		<title>{`@${project.title}`}</title>
		<h1>
			<Icon icon='FolderKanban' />
			<NavLink to={`/workspace/${params.workspaceId}/project/${project.id}`}>
				{project.title}
			</NavLink>
		</h1>

		<Tabs>
			<TabList>
				<Tab id='tasks'>Tasks</Tab>
				<Tab id='notes'>Notes</Tab>
			</TabList>

			<TabPanels>
				<TabPanel id='tasks'>
					<Board tasks={tasks} />
				</TabPanel>

				<TabPanel id='notes'>
					<div className="grid">
						{notes.map(note => <NoteCard key={note.id} note={note} />)}
					</div>
				</TabPanel>
			</TabPanels>
		</Tabs>
	</div>
}
