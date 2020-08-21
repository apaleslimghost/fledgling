class WrapperRenderHelper < React::Rails::ComponentMount
  def react_component(component_name, props, options)
    '<!doctype html>' << prerender_component(
             component_name,
             React.camelize_props(props),
             options[:prerender]
    )
  end
end

Rails.application.config.react.view_helper_implementation = WrapperRenderHelper
