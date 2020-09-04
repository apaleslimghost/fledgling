import React from 'react'

import Page from './Page'
import ProjectForm from './ProjectForm'
import ProjectList from './ProjectList'
import TaskList from './TaskList'
import Breadcrumbs from './Breadcrumbs'

import colourStyle from './colour-style'

export default ({ project, children, tasks, breadcrumbs, subproject, newTask, newProject }) => (
  <Page
    title={project.title}
    style={colourStyle(project.colours)}
    header={<Breadcrumbs breadcrumbs={breadcrumbs} />}
  >
    <TaskList tasks={tasks} newTask={newTask} project={project} />

    {(children.length > 0 || newProject) && (
      <ProjectList projects={children} newProject={newProject}/>
    )}
  </Page>
)
