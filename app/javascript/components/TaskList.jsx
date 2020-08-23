import React from 'react'
import TaskForm from './TaskForm'
import { Form, Input } from './Form'
import styles from './task-list.module.css'

export default ({ tasks, newTask }) => (
    <ul className={styles.main}>
      {tasks.map(task => (
        <li className={`${styles.item} ${task.completed ? styles.completed : ''}`} key={task.id}>
          <Form model={task}>
            <Input name='completed' type='hidden' value={!task.completed} />
            <button type='submit'>✓</button>
          </Form>
          {task.title}
        </li>
      ))}
      {newTask && (
          <li className={styles.item}><TaskForm task={newTask} /></li>
      )}
    </ul>
)
