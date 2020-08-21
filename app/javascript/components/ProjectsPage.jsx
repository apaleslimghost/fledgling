import React from 'react'
import ProjectList from './ProjectList'
import styles from './projects-page.module.css'

export default ({ projects }) => (
    <>
      <header className={styles.header}>
        <h1>Projects</h1>
      </header>

      <div className={styles.background}>
        <main className={styles.content}>
            <ProjectList projects={projects}/>
        </main>
      </div>
    </>
)
