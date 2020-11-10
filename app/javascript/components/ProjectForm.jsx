import React from "react"
import { Form, Input } from './Form'
import Page from './Page'
import Breadcrumbs from './Breadcrumbs'
import colourStyle from './colour-style'
import Button from './Button'

import styles from './project-form.module.css'

const ProjectForm = ({ project, breadcrumbs }) => (
  <Form model={project} className={styles.form}>
    <Page
      title={
        <Input
          autoFocus='autofocus'
          name='title'
          placeholder={!project.title && (project.id ? 'Project…' : 'New project…')}
          className={styles.seamless}
        />
      }
      style={colourStyle(project.colours)}
      aux={<>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <Button type='submit' className='primary'>
           {project.id ? 'Update project' : '✚ Create project'}
        </Button>
      </>}
    >
      <div className={styles.description}>
        <input type='hidden' id={`project-${project.id}-description`} name='project[description]' value={project.description && project.description.body} />
        <trix-editor input={`project-${project.id}-description`} />
      </div>
    </Page>
  </Form>
)

export default ProjectForm
