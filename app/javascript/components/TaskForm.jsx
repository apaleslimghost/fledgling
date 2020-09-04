import React from 'react'
import { Form, Input } from './Form'
import styles from './task-form.module.css'

export default ({ task }) => (
  <Form model={task} className={styles.main}>
    <Input name='title' />
    <input type='submit' />
  </Form>
)
