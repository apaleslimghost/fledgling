import { Prisma } from '@prisma/client'
import {Grid} from '@radix-ui/themes'
import TaskCard from './task'
import { PropsWithChildren } from 'react'

export default function TaskGrid({ tasks, children }: PropsWithChildren<{ tasks: Prisma.TaskGetPayload<{include: {tags: true}}>[] }>) {
	return <Grid flexGrow='1' columns='repeat(auto-fill, minmax(20em, 1fr))' gap='3'>
    {tasks.map(task => <TaskCard task={task} key={task.id} />)}

	{children}
  </Grid>
}
