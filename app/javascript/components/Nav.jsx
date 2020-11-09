import React from 'react'
import Logo from './Logo'
import Link from './Link'
import styles from './nav.module.css'

export default ({ user, defaultProject }) => (
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
              <Link to={defaultProject} action='archive'>Archived projects</Link>
            </li>
            <li>
              <Link href='/log-out'>Log out</Link>
            </li>
          </ul>
        </details>
      )}
    </nav>
)
