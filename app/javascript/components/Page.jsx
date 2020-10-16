import React from 'react'
import Logo from './Logo'
import styles from './page.module.css'

export default ({ title, aux, project, children, ...props }) => (
    <div {...props} className={`${styles.wrapper} ${props.className || ''}`}>
      <header className={styles.header}>
        <a href='/' className={styles.logo}>
          <Logo />
        </a>
        <div className={styles.aux}>{aux}</div>
        <h1>{title}</h1>
      </header>

      <div className={styles.background}>
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
)
