module Arbre::Context::Patch
  def initialize(assigns = {}, helpers = nil, &block)
    assigns.each { |k, v| instance_variable_set("@#{k}", v) }
    super({}, helpers, &block)
  end
end

Arbre::Context.prepend Arbre::Context::Patch

class ApplicationComponent < ViewComponent::Base
  def initialize(**props)
    @props = props.slice(*@@prop_names)
  end

  def call
    Arbre::Context.new(@props, self, &@@block).to_s
  end

  @@prop_names = []

  def self.render(&block)
    @@block = block
  end

  def self.properties(*props)
    @@prop_names = props
  end
end
