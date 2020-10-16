import React from 'react'
import styles from './link.module.css'

export default ({ to, action = 'show', className, ...props }) => (
    <a href={to._meta.urls[action]} className={`${styles.link} ${className}`} {...props} />
)
