import React from 'react'
import { Form, Input } from './Form'
import styles from './task-form.module.css'
import Button from './Button'

export default ({ task }) => (
  <Form model={task} className={styles.main}>
    <Input name='title' placeholder='New task…' className={styles.input} />
    <Button type='submit'>✚ Add task</Button>
  </Form>
)
