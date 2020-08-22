import React from 'react'
import Page from './Page'
import ProjectList from './ProjectList'
import colourStyle from './colour-style'

const defaultColours = {
    title: '#4D001C',
    base: '#F975A6',
    gradient_start: '#FFB678',
    gradient_end: '#B67AEF'
}

export default ({ projects }) => (
    <Page title='Projects' style={colourStyle(defaultColours)}>
      <ProjectList projects={projects}/>
    </Page>
)
