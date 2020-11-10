import React from 'react'
import styles from './toolbar.module.css'
import card from './card.module.css'

export default ({ inline, className, ...props }) => (
    <div className={`${styles.toolbar} ${inline ? '' : card.card} ${className}`} {...props} />
)
