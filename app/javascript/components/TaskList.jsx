import React from 'react'
import TaskForm from './TaskForm'
import TaskCompleteButton from './TaskCompleteButton'
import styles from './task-list.module.css'

export default ({ tasks, newTask }) => (
    <ul className={styles.main}>
      {tasks.map(task => (
        <li className={`${styles.item} ${task.completed ? styles.completed : ''}`} key={task.id}>
          <TaskCompleteButton task={task} />
          {task.title}
        </li>
      ))}
      {newTask && (
          <li className={styles.item}><TaskForm task={newTask} /></li>
      )}
    </ul>
)
