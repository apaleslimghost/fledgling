import React from 'react'
import { Form, Input } from './Form'
import styles from './task-complete-button.module.css'

export default ({ task, project }) => (
    <Form model={task} className={styles.form}>
      <Input name='completed' type='hidden' value={!task.completed} />
      {project && <input name='return_to' type='hidden' value={project._meta.url}/>}
      <button type='submit' aria-label={`Mark task as ${task.completed ? 'complete' : 'incomplete'}`} className={styles.button}>
        <span aria-hidden>{task.completed ? '✗' : '✓'}</span>
      </button>
    </Form>
)
