import React from 'react'
import {Form} from './Form'
import Page from './Page'

const LoginForm = () => (
  <Page title='Log in…' style={{ '--colour-base': 'lightcyan', '--colour-gradient_start': 'lavender', '--colour-gradient_end': 'honeydew', '--colour-title': 'midnightblue' }}>
    <Form method='post' action='/sessions'>
      <input name='email' type='email' />
      <input name='password' type='password' />

      <button type='submit'>Log in</button>
    </Form>
  </Page>
)

export default LoginForm
