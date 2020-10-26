import React from 'react'
import Logo from './Logo'
import styles from './nav.module.css'

export default ({ user }) => (
    <nav className={styles.nav}>
      <a href='/' className={styles.logo}>
        <Logo />
      </a>

      {user && (
        <details className={styles.user}>
          <summary>
            <img className={styles.gravatar} src={user.gravatar} />
            {user.email}
          </summary>
          <ul className={styles.menu}>
            <li>
              <a href='/log-out'>Log out</a>
            </li>
          </ul>
        </details>
      )}
    </nav>
)
