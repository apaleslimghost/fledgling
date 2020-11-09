import React from 'react'
import styles from './link.module.css'

export default ({ to, action = 'show', className, href, ...props }) => (
    <a href={href || to._meta.urls[action]} className={`${styles.link} ${className}`} {...props} />
)
