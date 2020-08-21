import React from 'react'
import ReactRailsUJS from 'react_ujs'
import Wrapper from '../components/Wrapper'
import * as ReactDomServer from 'react-dom/server'

ReactRailsUJS.useContext(require.context('components', true))

ReactRailsUJS.serverRender = function(renderFunction, componentName, {wrapperProps, ...props}) {
    const Component = this.getConstructor(componentName)
    return ReactDomServer[renderFunction](
        <Wrapper {...wrapperProps}>
          <Component {...props}/>
        </Wrapper>
    )
}
