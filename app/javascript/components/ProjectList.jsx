import React from 'react'

export default ({ projects }) => (
    <ul>
        {projects.map(project => (
            <li key={project.id}>
                <a href={project._meta.url}>
                    {project.title}
                </a>
            </li>
        ))}
    </ul>
)
