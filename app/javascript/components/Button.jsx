import React from 'react'
import styles from './button.module.scss'

export default ({ className, ...props }) => (
    <button className={`${styles.button} ${className}`} {...props} />
)
