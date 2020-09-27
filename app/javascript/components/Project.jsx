import React from 'react'

import Page from './Page'
import ProjectList from './ProjectList'
import TaskList from './TaskList'
import Breadcrumbs from './Breadcrumbs'
import Link from './Link'

import styles from './project.module.css'
import colourStyle from './colour-style'

export default ({ project, children, tasks, breadcrumbs, subproject, newTask, isDefaultProject }) => (
  <Page
    title={project.title}
    style={colourStyle(project.colours)}
    aux={<>
      {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}
    {!isDefaultProject && <Link to={project} action='edit'>Edit…</Link>}
    </>}
  >
    {project.description && (
      <div className={styles.description}>{project.description}</div>
    )}

    {(tasks.length > 0 || newTask) && (
      <TaskList tasks={tasks} newTask={newTask} project={project} />
    )}

    {(children.length > 0 || subproject) && (
      <ProjectList projects={children} newProject={subproject}/>
    )}
  </Page>
)
