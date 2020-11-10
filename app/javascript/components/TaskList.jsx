import React from 'react'
import partition from 'lodash.partition'
import TaskForm from './TaskForm'
import Action from './Action'
import Link from './Link'
import Toolbar from './Toolbar'

import colourStyle from './colour-style'
import button from './button.module.scss'
import styles from './task-list.module.css'

export const List = ({
  tasks,
  project,
  newTask,
  className,
  showControls,
  ...props
}) => (
  <ul className={`${styles.list} ${className}`} {...props}>
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

        <Toolbar inline>
          {showControls && (
            <>
              <Link to={task} action='edit'>
                ✎ Edit
              </Link>
              <Action
                model={task}
                method='delete'
                style={{ '--colour-title': '#900', '--colour-base': '#fcc' }}>
                ⌫ Delete
              </Action>
            </>
          )}
          {task.project.id !== project.id && (
            <Link
              to={task.project}
              style={colourStyle(task.project.colours)}
            >
              ☰ {task.project.title}
            </Link>
          )}
        </Toolbar>
      </li>
    ))}
  </ul>
)

export const TaskList = ({ className, ...props }) => (
  <List className={`${styles.part} ${className}`} {...props} />
)

export const FullTaskList = ({ tasks, newTask, project }) => {
  const [ complete, incomplete ] = partition(tasks, 'completed')

  return (
    <div className={styles.part}>
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
