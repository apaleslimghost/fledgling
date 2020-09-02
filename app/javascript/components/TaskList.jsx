import React from 'react'
import partition from 'lodash.partition'
import TaskForm from './TaskForm'
import TaskCompleteButton from './TaskCompleteButton'
import Link from './Link'
import colourStyle from './colour-style'
import styles from './task-list.module.css'

const List = ({ tasks, project }) => (
  <ul className={styles.list}>
    {tasks.map(task => (
      <li className={styles.item} key={task.id}>
        <TaskCompleteButton task={task} project={project} />
        <span className={`${styles.title} ${task.completed ? styles.completed : ''}`}>{task.title}</span>
        {task.project.id !== project.id && (
          <Link to={task.project} className={styles.projectLink} style={colourStyle(task.project.colours)}>{task.project.title}</Link>
        )}
      </li>
    ))}
  </ul>
)

export default ({ tasks, newTask, project }) => {
  const [ incomplete, complete ] = partition(tasks, 'completed')

  return (
    <div className={styles.main}>
      {complete.length > 0 && (
        <List tasks={complete} project={project} />
      )}
      {newTask && (
        <TaskForm task={newTask} />
      )}
      {incomplete.length > 0 && (
        <details>
          <summary>Completed tasks</summary>
          <List tasks={incomplete} project={project} />
        </details>
      )}
    </div>
  )
}
