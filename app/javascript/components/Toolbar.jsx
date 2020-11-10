import React from 'react'
import styles from './toolbar.module.css'

export default ({ className, ...props }) => (
    <div className={`${styles.toolbar} ${className}`} {...props} />
)
