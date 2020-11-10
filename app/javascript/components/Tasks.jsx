import React from 'react'

import Page from './Page'
import TaskList from './TaskList'
import Breadcrumbs from './Breadcrumbs'

import colourStyle from './colour-style'

export default ({ project, tasks, breadcrumbs, newTask }) => (
  <Page
    title='Tasks'
    style={colourStyle(project.colours)}
    aux={breadcrumbs.length > 0 && <Breadcrumbs breadcrumbs={breadcrumbs} />}
  >
    {(tasks.length > 0 || newTask) && (
      <TaskList tasks={tasks} newTask={!project.archived && newTask} project={project} main />
    )}
  </Page>
)
