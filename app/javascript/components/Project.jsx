import React from 'react'

import Page from './Page'
import ProjectForm from './ProjectForm'
import ProjectList from './ProjectList'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import Link from './Link'

import colourStyle from './colour-style'

export default ({ project, parent, children, tasks, subproject, newTask }) => (
  <Page
    title={project.title}
    style={colourStyle(project.colours)}
    header={parent && (
      <Link to={parent}>
        {parent.title}
      </Link>
    )}
  >
      { tasks.length > 0 && <TaskList tasks={tasks}/> }
      <TaskForm task={newTask} />

      { children.length > 0 && <ProjectList projects={children}/>}
      <ProjectForm project={subproject} />
    </Page>
)
