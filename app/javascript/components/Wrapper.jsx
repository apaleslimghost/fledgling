import React from 'react'
import {CSRFContext} from './CSRF.jsx'

export default ({ title, csrf, packs, children }) => (
  <CSRFContext.Provider value={csrf}>
    <html lang='en'>
      <head>
        <title>
          {title && `${title} ❦ `}
          Fledgling
        </title>
        <meta charset='utf8' />
        <meta name='csrf-param' value={csrf.param}/>
        <meta name='csrf-token' value={csrf.token}/>

        <link rel='stylesheet' href='/global.css' data-turbolinks-track='reload' />
        <link rel='stylesheet' href={packs.styles} data-turbolinks-track='reload' />
        <link rel='icon' href='/favicon.svg' />
        <script src={packs.scripts} data-turbolinks-track='reload' />
      </head>

      <body>
        {children}
      </body>
    </html>
  </CSRFContext.Provider>
)
