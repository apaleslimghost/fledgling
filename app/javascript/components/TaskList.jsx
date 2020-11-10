import React, { Children } from 'react'
import partition from 'lodash.partition'
import TaskForm from './TaskForm'
import Action from './Action'
import Link from './Link'
import Toolbar from './Toolbar'

import colourStyle from './colour-style'
import button from './button.module.scss'
import styles from './task-list.module.css'
import link from './link.module.css'

export const List = ({
  tasks,
  project,
  newTask,
  className,
  showControls,
  linkTasksPage,
  children,
  title,
  ...props
}) => (
  <ul className={`${styles.list} ${className}`} {...props}>
    {title && (
      <li className={styles.item}>
        <h3 className={styles.title}>{title}</h3>
      </li>
    )}

    {newTask && (
      <li className={styles.item}>
        <TaskForm task={newTask} />
      </li>
    )}

    {tasks.map(task => (
      <li className={styles.item} key={task.id}>
        <Action
          model={task}
          data={{ completed: !task.completed }}
          formChildren={
            <input
              name='return_to'
              type='hidden'
              value={
                showControls || task.completed
                  ? project._meta.urls.tasks
                  : project._meta.urls.show
              }
            />
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
            `${styles.taskTitle} ${task.completed ? styles.completed : ''}`
          }
        >
          {task.title}
        </span>

        <Toolbar inline>
          {showControls && (
            <>
              <Link to={task} action='edit'>
                ✎ Edit
              </Link>
              <Action
                model={task}
                method='delete'
                className={link.danger}
              >
                ⌫ Delete
              </Action>
            </>
          )}
          {task.project.id !== project.id && (
            <Link
              to={task.project}
              action={linkTasksPage ? 'tasks' : 'show'}
              style={colourStyle(task.project.colours)}
            >
              ☰ {task.project.title}
            </Link>
          )}
        </Toolbar>
      </li>
    ))}
    {Children.toArray(children).filter(Boolean).map((child, index) => (
      <li className={styles.item} key={index}>{child}</li>
    ))}
  </ul>
)

export const TaskList = ({ className, ...props }) => (
  <List className={`${styles.part} ${className}`} {...props} />
)

export const FullTaskList = ({ tasks, newTask, project, className }) => {
  const [ complete, incomplete ] = partition(tasks, 'completed')

  return (
    <div className={`${styles.part} ${className}`}>
      {(incomplete.length > 0 || newTask) && (
        <TaskList
          showControls
          tasks={incomplete}
          newTask={newTask}
          project={project}
          style={{'--task-list-height': incomplete.length + (newTask ? 1 : 0)}}
          className='' />
      )}

      {complete.length > 0 && (
        <details style={{'--task-list-height': complete.length}}>
          <summary className={styles.summary}>Completed tasks</summary>
          <TaskList tasks={complete} project={project} className='' />
        </details>
      )}
    </div>
  )
}
