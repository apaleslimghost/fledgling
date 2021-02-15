import React from 'react'
import ReactRailsUJS from 'react_ujs'
import * as ReactDomServer from 'react-dom/server'
import Wrapper from '../components/Wrapper'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)

const context = require.context('components', true)

ReactRailsUJS.getConstructor = className => context('./' + className).default

ReactRailsUJS.serverRender = function(renderFunction, componentName, {wrapperProps, ...props}) {
    const Component = this.getConstructor(componentName)
    return ReactDomServer[renderFunction](
        <Wrapper {...wrapperProps}>
          <Component {...props}/>
        </Wrapper>
    )
}
