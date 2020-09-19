import React from 'react'

export default ({ to, action = 'show', ...props }) => (
    <a href={to._meta.urls[action]} {...props} />
)
