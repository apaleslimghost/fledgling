import React from 'react'

import Page from './Page'
import ProjectForm from './ProjectForm'
import ProjectList from './ProjectList'
import TaskList from './TaskList'
import Breadcrumbs from './Breadcrumbs'

import colourStyle from './colour-style'

export default ({ project, parent, children, tasks, breadcrumbs, subproject, newTask }) => (
  <Page
    title={project.title}
    style={colourStyle(project.colours)}
    header={<Breadcrumbs breadcrumbs={breadcrumbs} />}
  >
    <TaskList tasks={tasks} newTask={newTask} />

    { children.length > 0 && <ProjectList projects={children}/>}
    <ProjectForm project={subproject} />
  </Page>
)
