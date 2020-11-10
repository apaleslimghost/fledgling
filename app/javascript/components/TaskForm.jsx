import React from 'react'
import { Form, Input } from './Form'
import styles from './task-form.module.css'
import Button from './Button'

export default ({ task, project, className }) => (
  <Form model={task} className={`${styles.main} ${className}`}>
    <Input name='title' placeholder='New task…' className={styles.input} />
    {task.id && project && (
      <input type='hidden' name='return_to' value={project._meta.urls.tasks} />
    )}
    <Button type='submit'>{task.id ? '✓ Save' : '✚ Add'} task</Button>
  </Form>
)
