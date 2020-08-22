import React from 'react'
import colourStyle from './colour-style'
import styles from './project-card.module.css'

export default ({ project }) => (
    <a href={project._meta.url} className={styles.main} style={colourStyle(project.colours)}>
        <h2 className={styles.title}>{project.title}</h2>
    </a>
)
