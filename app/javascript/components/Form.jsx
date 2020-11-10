import React, { createContext, useContext } from 'react'
import { CSRFContext } from './CSRF'

const Model = createContext()

const getFormProps = ({ model, ...props }) => {
  if(model) {
    const { urls, method } = model._meta

    return { action: urls.action, method, ...props }
  }

  return props
}

export function Form({ model, children, ...props }) {
  const {param, token} = useContext(CSRFContext) || {}
  const { method, ...formProps } = getFormProps({ model, ...props })
  const unsupportedMethod = !['get', 'post'].includes(method)
  const actualMethod = unsupportedMethod ? 'post' : method

  return (
    <form method={actualMethod} {...formProps}>
      {token && <input name={param} value={token} type='hidden' />}
      {unsupportedMethod && (
       <input name="_method" type="hidden" value={method} />
      )}

      {model ? (
        <Model.Provider value={model}>
          {children}
        </Model.Provider>
      ) : children}
    </form>
  )
}

export function Input({ name, tag: Tag = 'input', ...props }) {
  const model = useContext(Model)
  const fullName = `${model._meta.modelName}[${name}]`

  return <Tag name={fullName} defaultValue={model[name] || ''} {...props} />
}

