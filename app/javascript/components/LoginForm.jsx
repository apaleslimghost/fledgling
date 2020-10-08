import React from 'react'
import {Form, Input} from './Form'
import Page from './Page'

import styles from './login-form.module.css'

const LoginForm = ({ user }) => (
  <Page title='Hi!' style={{ '--colour-base': 'lightcyan', '--colour-gradient_start': 'lavender', '--colour-gradient_end': 'honeydew', '--colour-title': 'midnightblue' }}>
    <Form method='post' action='/sessions' className={styles.form}>
      <h2 className={styles.subtitle}>Log in</h2>
      <input name='email' type='email' />
      <input name='password' type='password' />

      <button type='submit' className='primary'>Log in</button>
    </Form>

    <Form model={user} className={styles.form}>
      <h2 className={styles.subtitle}>Sign up</h2>
      <Input name='email' type='email' />
      <Input name='password' type='password' />
      <Input name='password_confirmation' type='password' />

      <button type='submit'>Sign up</button>
    </Form>
  </Page>
)

export default LoginForm
