import React, {createContext, useContext} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Page from './Page'
import ProjectCard from './ProjectCard'
import Breadcrumbs from './Breadcrumbs'
import Action from './Action'
import colourStyle from './colour-style'

import styles from './project-tree.module.css'

const CurrentProjectContext = createContext(null)
const SubjectContext = createContext(null)

const ProjectTreeChildren = ({ projects, disabled, root }) => (
   <div class={`${styles.tree} ${root ? styles.root : ''}`}>
      {projects.map(child => (
         <ProjectTree entry={child} disabled={disabled} />
      ))}
   </div>
)

const MoveToProjectForm = ({ project, children, className, ...props }) => {
   const subject = useContext(SubjectContext)

   return <Action
      buttonProps={props}
      className={className}
      model={subject}
      data={{parent_id: project.id}}
   >
      {children}
   </Action>
}

const ProjectTree = ({ entry: { item, children }, root, disabled: parentDisabled }) => {
   const currentProject = useContext(CurrentProjectContext)
   const isCurrent = currentProject.id === item.id
   const isParent = children.some(child => child.item.id === currentProject.id)
   const disableChildren = isCurrent || parentDisabled
   const disabled = isParent || disableChildren

   return <div class={styles.item}>
      <ProjectCard
         as={MoveToProjectForm}
         small
         primary={isCurrent}
         project={item}
         disabled={disabled}
         accessory={!disabled && <FontAwesomeIcon icon="file-export" />}
      />
      {children.length > 0 && (
         <ProjectTreeChildren projects={children} disabled={disableChildren} root={root} />
      )}
   </div>
}

export default ({ tree, project, subject, breadcrumbs }) => (
   <Page
      title={`Move ${subject.title} to…`}
      project={project}
      style={colourStyle(project.colours)}
      aux={<>
         {breadcrumbs.length > 0 && <Breadcrumbs breadcrumbs={breadcrumbs} />}
      </>}
   >
      <CurrentProjectContext.Provider value={project}>
         <SubjectContext.Provider value={subject}>
            <ProjectTree entry={tree} root />
         </SubjectContext.Provider>
      </CurrentProjectContext.Provider>
   </Page>
)
