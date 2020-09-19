import React from 'react'
import Link from './Link'
import colourStyle from './colour-style'
import styles from './project-card.module.css'

export default ({ project }) => (
  <Link
    to={project}
    className={styles.main}
    style={colourStyle(project.colours)}
  >
    <h2 className={styles.title}>{project.title}</h2>
  </Link>
)
