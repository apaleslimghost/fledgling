import React from 'react'
import Nav from './Nav.jsx'
import {CSRFContext} from './CSRF.jsx'

export default ({ title, csrf, packs, user, children }) => (
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
        <meta name='viewport' content='width=device-width, initial-scale=1' />

        <link rel='stylesheet' href='/global.css' data-turbolinks-track='reload' />
        <link rel='stylesheet' href={packs.styles} data-turbolinks-track='reload' />
        <link rel='icon' href='/favicon.svg' />
        <script src={packs.scripts} data-turbolinks-track='reload' />
      </head>

      <body>
        <Nav user={user} />
        {children}
      </body>
    </html>
  </CSRFContext.Provider>
)
