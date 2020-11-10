import React from 'react'

import Page from './Page'
import { FullTaskList, TaskList } from './TaskList'
import Breadcrumbs from './Breadcrumbs'

import styles from './tasks.module.css'
import colourStyle from './colour-style'

export default ({ project, tasks, breadcrumbs, newTask, hierarchyTasks }) => (
  <Page
    title='Tasks'
    style={colourStyle(project.colours)}
    aux={breadcrumbs.length > 0 && <Breadcrumbs breadcrumbs={breadcrumbs} />}
    contentClass={styles.grid}
  >
    <FullTaskList tasks={tasks} newTask={!project.archived && newTask} project={project} className={styles.left} />

    {hierarchyTasks.length > 0 && (
      <TaskList title='From subprojects' tasks={hierarchyTasks} project={project} linkTasksPage className={styles.right} />
    )}
  </Page>
)
