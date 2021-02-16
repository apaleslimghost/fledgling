import React from 'react'
import ProjectCard from './ProjectCard'

export default ({ projects, newProject }) => (
    <>
      {newProject && <ProjectCard project={newProject} primary accessory='+' />}
      {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
      ))}
    </>
)
