import React from 'react'
import styles from './project-card.module.css'
// const styles = {}

export default ({ project }) => (
    <a href={project._meta.url} className={styles.main}>
        <h2 className={styles.title}>{project.title}</h2>
    </a>
)
