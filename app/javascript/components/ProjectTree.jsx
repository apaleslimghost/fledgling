import React, {createContext, useContext} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Page from './Page'
import ProjectCard from './ProjectCard'
import Breadcrumbs from './Breadcrumbs'
import Action from './Action'
import colourStyle from './colour-style'

import styles from './project-tree.module.css'

const CurrentProjectContext = createContext(null)

const ProjectTreeChildren = ({ projects, disabled }) => (
   <ul class={styles.tree}>
      {projects.map(child => (
         <ProjectTree entry={child} disabled={disabled} />
      ))}
   </ul>
)

const MoveToProjectForm = ({ project, children, className, ...props }) => {
   const currentProject = useContext(CurrentProjectContext)

   return <Action
      buttonProps={props}
      className={className}
      model={currentProject}
      data={{parent_id: project.id}}
   >
      {children}
   </Action>
}

const ProjectTree = ({ entry: { item, children }, as: As = 'li', isChild, disabled: parentDisabled }) => {
   const currentProject = useContext(CurrentProjectContext)
   const isCurrent = currentProject.id === item.id
   const isParent = children.some(child => child.item.id === currentProject.id)
   const disableChildren = isCurrent || parentDisabled
   const disabled = isParent || disableChildren

   return <As class={styles.item}>
      <ProjectCard
         as={MoveToProjectForm}
         small
         primary={isCurrent}
         project={item}
         disabled={disabled}
         accessory={!disabled && <FontAwesomeIcon icon="file-export" />}
      />
      {children.length > 0 && (
         <ProjectTreeChildren projects={children} disabled={disableChildren} />
      )}
   </As>
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
         <ProjectTree entry={tree} as='div' />
      </CurrentProjectContext.Provider>
   </Page>
)
