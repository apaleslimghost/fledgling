import React from 'react'
import TaskForm from './TaskForm'
import TaskCompleteButton from './TaskCompleteButton'
import Link from './Link'
import colourStyle from './colour-style'
import styles from './task-list.module.css'

export default ({ tasks, newTask, project }) => (
    <ul className={styles.main}>
      {tasks.map(task => (
        <li className={styles.item} key={task.id}>
          <TaskCompleteButton task={task} project={project} />
          <span className={`${styles.title} ${task.completed ? styles.completed : ''}`}>{task.title}</span>
          {task.project.id !== project.id && (
            <Link to={task.project} className={styles.projectLink} style={colourStyle(task.project.colours)}>{task.project.title}</Link>
          )}
        </li>
      ))}
      {newTask && (
          <li className={styles.item}><TaskForm task={newTask} /></li>
      )}
    </ul>
)
