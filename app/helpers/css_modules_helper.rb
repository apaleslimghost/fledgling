module CssModulesHelper
  def css(class_name)
    component = action_name == 'index' ? controller_name : action_name
    "#{component}_#{class_name}"
  end
end
