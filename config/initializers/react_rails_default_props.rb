module React::Rails::ControllerRenderer::Patch
  def initialize(options = {})
    @controller = options[:controller]
    super
  end

  def call(component_name, options, &block)
    orig_props = options.fetch(:props, {})
    props = orig_props.merge(@controller.default_props(orig_props))
    super(
      component_name,
      options.merge({prerender: :static, camelize_props: true, props: props}),
      &block
    )
  end
end

React::Rails::ControllerRenderer.prepend React::Rails::ControllerRenderer::Patch
