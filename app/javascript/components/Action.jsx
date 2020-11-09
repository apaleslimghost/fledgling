import React from 'react'
import { Form, Input } from './Form'
import styles from './link.module.css'
import button from './button.module.scss'

export default ({ data, className, children, ...props }) => (
    <Form {...props}>
      {Object.keys(data).map(key => (
          <Input type='hidden' name={key} key={key} value={data[key]} />
      ))}
      <button type='submit' className={`${button.unstyled} ${styles.link} ${className}`}>
        {children}
      </button>
    </Form>
)
