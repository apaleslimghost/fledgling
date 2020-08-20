import React from 'react'
import ProjectCard from './ProjectCard'

export default ({ projects }) => (
    <>
        {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
        ))}
    </>
)
