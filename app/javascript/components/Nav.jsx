import React from 'react'
import Logo from './Logo'
import styles from './nav.module.css'

export default ({ user }) => (
    <nav className={styles.nav}>
      <a href='/' className={styles.logo}>
        <Logo />
      </a>

      {user && (
          <span className={styles.user}>
            <img className={styles.gravatar} src={user.gravatar} />
            <span>{user.email}</span>
          </span>
      )}
    </nav>
)
