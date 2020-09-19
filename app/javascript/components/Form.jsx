import React, { createContext, useContext } from 'react'
import {CSRFContext} from './CSRF'

const Model = createContext()

export function Form({ model, children, ...props }) {
  const {urls, method} = model._meta
  const {param, token} = useContext(CSRFContext) || {}
  const unsupportedMethod = !['get', 'post'].includes(method)
  const actualMethod = unsupportedMethod ? 'post' : method

  return (
    <form action={urls.action} method={actualMethod} {...props}>
      {token && <input name={param} value={token} type='hidden' />}
      {unsupportedMethod && (
       <input name="_method" type="hidden" value={method} />
      )}

      <Model.Provider value={model}>
        {children}
      </Model.Provider>
    </form>
  )
}

export function Input({ name, ...props }) {
  const model = useContext(Model)
  const fullName = `${model._meta.modelName}[${name}]`

  return <input name={fullName} defaultValue={model[name] || ''} {...props}/>
}
