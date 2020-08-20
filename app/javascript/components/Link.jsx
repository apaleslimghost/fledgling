import React from 'react'

export default ({ to,  ...props }) => (
    <a href={to._meta.url} {...props} />
)
