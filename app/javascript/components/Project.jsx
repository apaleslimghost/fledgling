import React from 'react'

import Page from './Page'
import ProjectList from './ProjectList'
import { TaskList } from './TaskList'
import Breadcrumbs from './Breadcrumbs'
import Link from './Link'
import Action from './Action'
import Toolbar from './Toolbar'

import styles from './project.module.css'
import link from './link.module.css'
import colourStyle from './colour-style'

export default ({ project, children, tasks, breadcrumbs, subproject, newTask, isDefaultProject, overrideTitle }) => (
  <Page
    title={overrideTitle || project.title}
    style={colourStyle(project.colours)}
    contentClass={styles.grid}
    aux={<>
      {breadcrumbs.length > 0 && <Breadcrumbs breadcrumbs={breadcrumbs} />}
    </>}
  >
    {project.description && project.description.body && (
      <div
        className={styles.description}
        style={{
          '--description-height': Math.max(1, Math.floor(project.description.length / 50 / 2))
        }}
        dangerouslySetInnerHTML={{__html: project.description.body}}
      />
    )}

  {!isDefaultProject && (
    <Toolbar className={styles.left}>
      <Link to={project} action='tasks'>☰ Tasks</Link>
      {!project.archived && (
        <Link to={project} action='edit'>✎ Edit</Link>
      )}
      <Action model={project} data={{ archived: !project.archived }}>
        ♲ {project.archived ? 'Unarchive' : 'Archive'}
      </Action>
      {project.archived && (
        <Action
          model={project}
          method='delete'
          className={link.danger}
        >
          ⌫ Delete
        </Action>
      )}
    </Toolbar>
  )}

    {(tasks.length > 0 || newTask) && (
      <TaskList
        tasks={tasks.slice(0, 10)}
        newTask={!project.archived && newTask}
        project={project}
        className={styles.left}
      >
        {tasks.length > 10 && (
          <Link to={project} action='tasks'>More tasks&hellip;</Link>
        )}
      </TaskList>
    )}

    {(children.length > 0 || subproject) && (
      <ProjectList projects={children} newProject={!project.archived && subproject}/>
    )}
  </Page>
)
