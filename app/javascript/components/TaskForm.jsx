import React from 'react'
import { Form, Input } from './Form'

export default ({ task }) => (
    <Form model={task}>
      <Input name='title' />
      <input type='submit' />
    </Form>
)
