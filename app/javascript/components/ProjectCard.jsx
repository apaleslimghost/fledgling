import React from 'react'
import styles from './project-card.module.css'
// const styles = {}

export default ({ project }) => (
    <article className={styles.main}>
        <h2 className={styles.title}>{project.title}</h2>
    </article>
)
