import React, { createContext, useContext } from 'react'

const Model = createContext()

export function Form({ model, children, ...props }) {
    const {url, method} = model._meta
    const unsupportedMethod = !['get', 'post'].includes(method)
    const actualMethod = unsupportedMethod ? 'post' : method

    return (
        <form action={url} method={actualMethod} {...props}>
          {unsupportedMethod &&
           <input name="_method" type="hidden" value={method} />}

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
