import React from 'react'
import {Form, Input} from './Form'

const SignupForm = ({ user }) => (
    <Form model={user}>
      <Input name='email' type='email' />
      <Input name='password' type='password' />
      <Input name='password_confirmation' type='password' />

      <button type='submit'>Sign up</button>
    </Form>
)

export default SignupForm
