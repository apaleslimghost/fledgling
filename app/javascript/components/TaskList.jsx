import React, { Children } from 'react'
import partition from 'lodash.partition'
import TaskForm from './TaskForm'
import Action from './Action'
import Link from './Link'
import colourStyle from './colour-style'
import button from './button.module.scss'
import styles from './task-list.module.css'


const List = ({ tasks, project, children, className = '', ...props }) => (
  <ul className={`${styles.list} ${className}`} {...props}>
    {Children.map(children, (child, index) => (
      <li className={styles.item} key={index}>{child}</li>
    ))}

    {tasks.map(task => (
      <li className={styles.item} key={task.id}>
        <Action
          model={task}
          data={{ completed: !task.completed }}
          formChildren={
            <input name='return_to' type='hidden' value={project._meta.urls.show}/>
          }
          buttonProps={{
            'aria-label': `Mark task as ${task.completed ? 'complete' : 'incomplete'}`,
            disabled: project.archived,
            className: `${button.button} ${styles.completeButton}`
          }}>
          <span aria-hidden>{task.completed ? '✗' : '✓'}</span>
        </Action>
        <span
          className={
            `${styles.title} ${task.completed ? styles.completed : ''}`
          }
        >
          {task.title}
        </span>
        {task.project.id !== project.id && (
          <Link
            to={task.project}
            className={styles.projectLink}
            style={colourStyle(task.project.colours)}
          >
            {task.project.title}
          </Link>
        )}
      </li>
    ))}
  </ul>
)

export default ({ tasks, newTask, project }) => {
  const [ complete, incomplete ] = partition(tasks, 'completed')

  return (
    <>
      {(incomplete.length > 0 || newTask) && (
        <List tasks={incomplete} project={project} className={styles.part} style={{'--task-list-height': incomplete.length + (newTask ? 1 : 0)}}>
          {newTask && <TaskForm task={newTask} />}
        </List>
      )}

      {complete.length > 0 && (
        <details className={styles.part} style={{'--task-list-height': complete.length}}>
          <summary className={styles.summary}>Completed tasks</summary>
          <List tasks={complete} project={project} />
        </details>
      )}
    </>
  )
}
