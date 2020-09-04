import React from 'react'
import ProjectCard from './ProjectCard'
import styles from './project-list.module.css'

export default ({ projects, newProject }) => (
    <div className={styles.main}>
        {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
        ))}
      {newProject && <ProjectCard project={newProject}/>}
    </div>
)
