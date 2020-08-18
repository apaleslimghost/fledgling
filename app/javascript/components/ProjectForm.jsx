import React from "react"
import { Form, Input } from './Form'

const ProjectForm = ({ project }) => (
  <Form model={project}>
    <Input name='title' />

    <input type='submit' />
  </Form>
)

export default ProjectForm
