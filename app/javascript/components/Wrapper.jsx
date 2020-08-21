import React from 'react'
import {CSRFContext} from './CSRF.jsx'

export default ({ csrf, packs, children }) => (
  <CSRFContext.Provider value={csrf}>
    <html>
      <head>
        <title>Fledgling</title>
        <meta name='csrf-param' value={csrf.param}/>
        <meta name='csrf-token' value={csrf.token}/>

        <link rel='stylesheet' href={packs.styles} data-turbolinks-track='reload' />
        <script src={packs.scripts} data-turbolinks-track='reload' />
      </head>

      <body>
        {children}
      </body>
    </html>
  </CSRFContext.Provider>
)
