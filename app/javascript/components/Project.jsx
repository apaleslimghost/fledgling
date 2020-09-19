import React from 'react'

import Page from './Page'
import ProjectList from './ProjectList'
import TaskList from './TaskList'
import Breadcrumbs from './Breadcrumbs'

import colourStyle from './colour-style'

export default ({ project, children, tasks, breadcrumbs, subproject, newTask }) => (
  <Page
    title={project.title}
    style={colourStyle(project.colours)}
    header={breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}
  >
    <TaskList tasks={tasks} newTask={newTask} project={project} />

    {(children.length > 0 || subproject) && (
      <ProjectList projects={children} newProject={subproject}/>
    )}
  </Page>
)
