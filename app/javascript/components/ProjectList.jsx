import React from 'react'
import ProjectCard from './ProjectCard'

export default ({ projects, newProject }) => (
    <>
        {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
        ))}
      {newProject && <ProjectCard project={newProject}/>}
    </>
)
