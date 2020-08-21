import React from 'react'
import ProjectCard from './ProjectCard'
import styles from './project-list.module.css'

export default ({ projects }) => (
    <div className={styles.main}>
        {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
        ))}
    </div>
)
