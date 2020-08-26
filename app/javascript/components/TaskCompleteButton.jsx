import React from 'react'
import { Form, Input } from './Form'
import styles from './task-complete-button.module.css'

export default ({ task }) => (
    <Form model={task} className={styles.form}>
      <Input name='completed' type='hidden' value={!task.completed} />
      <button type='submit' aria-label={`Mark task as ${task.completed ? 'complete' : 'incomplete'}`} className={styles.button}>
        <span aria-hidden>{task.completed ? '✗' : '✓'}</span>
      </button>
    </Form>
)
