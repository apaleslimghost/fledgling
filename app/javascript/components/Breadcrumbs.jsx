import React from 'react'
import Link from './Link'
import styles from './breadcrumbs.module.css'

export default ({ breadcrumbs }) => (
    <ul className={styles.main}>
      <li className={styles.item}>
        <a href='/' className={styles.link}>Projects</a>
      </li>
      {breadcrumbs.map(crumb => (
          <li key={crumb.id} className={styles.item}>
            <Link to={crumb} className={styles.link}>
              {crumb.title}
            </Link>
          </li>
      ))}
    </ul>
)
