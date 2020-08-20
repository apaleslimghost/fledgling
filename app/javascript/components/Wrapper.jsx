import React from 'react'
import {CSRFContext} from './CSRF.jsx'

// TODO automatically wrap pages
export default ({ csrf, children }) => (
    <CSRFContext.Provider value={csrf}>
      {children}
    </CSRFContext.Provider>
)
