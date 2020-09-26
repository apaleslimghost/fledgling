import React from 'react'
import {Form} from './Form'

const LoginForm = () => (
    <Form method='post' action='/sessions'>
      <input name='email' type='email' />
      <input name='password' type='password' />

      <button type='submit'>Log in</button>
    </Form>
)

export default LoginForm
