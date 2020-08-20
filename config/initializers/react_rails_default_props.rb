module React::Rails::ControllerRenderer::Patch
  def initialize(options = {})
    @controller = options[:controller]
    super
  end

  def call(component_name, options, &block)
    props = options.fetch(:props, {}).merge(@controller.default_props)
    super(
      component_name,
      options.merge({camelize_props: true, props: props}),
      &block
    )
  end
end

React::Rails::ControllerRenderer.prepend React::Rails::ControllerRenderer::Patch
