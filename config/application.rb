require_relative 'boot'

require "rails"

require "active_model/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_view/railtie"

Bundler.require(*Rails.groups)

module Fledgling
  class Application < Rails::Application
    config.load_defaults 6.0

    config.generators.template_engine = false
    config.generators.view_specs = false
    config.generators.assets = false
    config.generators.helper = false
    config.generators.system_tests = false
  end
end
