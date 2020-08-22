import React from 'react'
import styles from './page.module.css'

export default ({ title, header, children, ...props }) => (
    <div {...props} className={`${styles.wrapper} ${props.className || ''}`}>
      <header className={styles.header}>
        {header}
        <h1>{title}</h1>
      </header>

      <div className={styles.background}>
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
)
