require_relative "boot"

require "rails"

require "active_model/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_view/railtie"

Bundler.require(*Rails.groups)

module Fledgling
  class Application < Rails::Application
    config.load_defaults 6.0

    config.force_ssl = true

    config.generators.template_engine = nil
    config.generators.view_specs = nil
    config.generators.assets = nil
    config.generators.helper = nil
    config.generators.system_tests = nil
  end
end
