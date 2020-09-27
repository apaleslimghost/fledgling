import React from 'react'
import { Form, Input } from './Form'
import styles from './task-form.module.css'

export default ({ task }) => (
  <Form model={task} className={styles.main}>
    <Input name='title' placeholder='New task…' className={styles.input} />
    <input type='submit' value='✚ Add task' />
  </Form>
)
