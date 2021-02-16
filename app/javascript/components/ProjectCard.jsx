import React from 'react'
import Link from './Link'
import colourStyle from './colour-style'
import styles from './project-card.module.css'

const ProjectLink = ({ project, ...props }) => <Link to={project} {...props} />

export default ({ as: Component = ProjectLink, project, accessory, primary, small, className, ...props }) => (
  <Component
    project={project}
    className={`${styles.main} ${primary ? styles.primary : ''} ${small ? styles.small : ''} ${className}`}
    style={colourStyle(project.colours)}
    {...props}
  >
    <h2 className={styles.title}>{accessory} {project.title}</h2>
    {!small && <ul class={styles.details}>
      {project.tasks_count && <li>{project.tasks_count}</li>}
      {project.projects_count && <li>{project.projects_count}</li>}
    </ul>}
  </Component>
)
