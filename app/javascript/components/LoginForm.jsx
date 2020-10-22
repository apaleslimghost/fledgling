import React from 'react'
import {Form, Input} from './Form'
import Page from './Page'

import styles from './login-form.module.css'

const LoginForm = ({ user }) => (
  <Page
    title='Hi!'
    style={{ '--colour-base': 'lightcyan', '--colour-gradient_start': 'lavender', '--colour-gradient_end': 'honeydew', '--colour-title': 'midnightblue' }}
    contentClass={styles.forms}
  >
    <Form method='post' action='/sessions' className={styles.form}>
      <h2 className={styles.title}>Log in</h2>

      <div className={styles.fields}>
        <label className={`${styles.label} ${styles.wide}`}>
          Email address
          <input name='email' type='email' />
        </label>

        <label className={styles.label}>
          Password
          <input name='password' type='password' />
        </label>
      </div>

      <button type='submit' className='primary big'>Log in</button>
    </Form>

    <Form model={user} className={styles.form}>
      <h2 className={styles.title}>Sign up</h2>
      <div className={styles.fields}>
        <label className={`${styles.label} ${styles.wide}`}>
          Email address
          <Input name='email' type='email' />
        </label>
        <label className={styles.label}>
          Password
          <Input name='password' type='password' />
        </label>
        <label className={styles.label}>
          Confirm password
          <Input name='password_confirmation' type='password' />
        </label>
      </div>
      <button type='submit' className='big'>Sign up</button>
    </Form>
  </Page>
)

export default LoginForm
