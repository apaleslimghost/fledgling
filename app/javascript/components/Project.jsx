import React from 'react'

import Wrapper from './Wrapper'
import ProjectForm from './ProjectForm'
import ProjectList from './ProjectList'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import Link from './Link'

export default ({ project, parent, children, tasks, subproject, newTask }) => (
    <>
      <h1>{project.title}</h1>
      {parent && (
          <Link to={parent}>
            {parent.title}
          </Link>
      )}

      { children.length > 0 && <ProjectList projects={children}/>}

      <ProjectForm project={subproject} />

      { tasks.length > 0 && <TaskList tasks={tasks}/> }
      <TaskForm task={newTask} />
    </>
)
