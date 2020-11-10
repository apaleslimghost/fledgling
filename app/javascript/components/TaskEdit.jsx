import React from 'react'
import Page from './Page'
import Breadcrumbs from './Breadcrumbs'
import TaskForm from './TaskForm'

import colourStyle from './colour-style'
import card from './card.module.css'

export default ({ task, project, breadcrumbs }) => (
    <Page
      title={task.title}
      style={colourStyle(project.colours)}
      aux={<Breadcrumbs breadcrumbs={breadcrumbs} />}
    >
      <TaskForm task={task} project={project} className={card.card} />
    </Page>
)
