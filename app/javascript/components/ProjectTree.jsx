import React, {createContext, useContext} from 'react'
import Page from './Page'
import ProjectCard from './ProjectCard'
import Breadcrumbs from './Breadcrumbs'
import colourStyle from './colour-style'

import styles from './project-tree.module.css'

const CurrentProjectContext = createContext(null)

const ProjectTreeChildren = ({ projects }) => (
   <ul class={styles.tree}>
      {projects.map(child => (
         <ProjectTree entry={child} />
      ))}
   </ul>
)

const ProjectTree = ({ entry: { item, children } }) => {
   const currentProject = useContext(CurrentProjectContext)
   const isCurrent = currentProject.id === item.id

   return <li class={`${styles.item} ${isCurrent ? styles.disabled : ''}`}>
      <ProjectCard small primary={isCurrent} project={item} />
      {children.length > 0 && (
         <ProjectTreeChildren projects={children} />
      )}
   </li>
}

export default ({ tree, project, breadcrumbs }) => (
   <Page
      title={`Move ${project.title} to…`}
      project={project}
      style={colourStyle(project.colours)}
      aux={<>
         {breadcrumbs.length > 0 && <Breadcrumbs breadcrumbs={breadcrumbs} />}
      </>}
   >
      <CurrentProjectContext.Provider value={project}>
         <ProjectTreeChildren disableWhen={project} projects={tree.children} />
      </CurrentProjectContext.Provider>
   </Page>
)
