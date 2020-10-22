import React from "react"
import { Form, Input } from './Form'
import Page from './Page'
import Breadcrumbs from './Breadcrumbs'
import colourStyle from './colour-style'

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
        <button type='submit' className='primary'>
           {project.id ? 'Update project' : '✚ Create project'}
        </button>
      </>}
    >
      <div className={styles.description}>
        <Input tag='textarea' name='description' className={styles.seamless} placeholder='Project description…' />
      </div>
    </Page>
  </Form>
)

export default ProjectForm
