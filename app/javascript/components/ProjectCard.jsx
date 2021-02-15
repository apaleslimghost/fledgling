import React from 'react'
import Link from './Link'
import colourStyle from './colour-style'
import styles from './project-card.module.css'

export default ({ project, primary, small }) => (
  <Link
    to={project}
    className={`${styles.main} ${primary ? styles.primary : ''} ${small ? styles.small : ''}`}
    style={colourStyle(project.colours)}
  >
    <h2 className={styles.title}>{!project.id && '+ '}{project.title}</h2>
    {project.tasks_count && <div>{project.tasks_count}</div>}
    {project.projects_count && <div>{project.projects_count}</div>}
  </Link>
)
