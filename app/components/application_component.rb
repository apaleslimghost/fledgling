module Arbre::Context::Patch
  def initialize(assigns = {}, helpers = nil, &block)
    assigns.each { |k, v| instance_variable_set("@#{k}", v) }
    super({}, helpers, &block)
  end
end

Arbre::Context.prepend Arbre::Context::Patch

class HelperTag < Arbre::HTML::Tag
  def initialize(context, tag)
    super(context)
    @tag_name = tag
  end
end

class ArbreFormBuilder < ActionView::Helpers::FormBuilder
  field_helpers.each do |method|
    class_eval <<-RUBY_EVAL, __FILE__, __LINE__ + 1
      def #{method}(*)
        tag = super
        @template.arbre { text_node(tag) }
      end
    RUBY_EVAL
  end
end

class ApplicationComponent < ViewComponent::Base
  def initialize(**props)
    @props = props.slice(*@@prop_names)
  end

  def call
    @context = Arbre::Context.new(@props, self)
    arbre(&@@block)
    @context.to_s
  end

  def arbre(&block)
    @context.instance_eval(&block)
  end

  def form_with(model: nil, scope: nil, url: nil, format: nil, **options, &block)
    options[:allow_method_names_outside_object] = true
    options[:skip_default_ids] = !form_with_generates_ids

    if model
      url ||= polymorphic_path(model, format: format)

      model   = model.last if model.is_a?(Array)
      scope ||= model_name_from_record_or_class(model).param_key
    end

    html_options = html_options_for_form_with(url, model, **options)

    builder = ArbreFormBuilder.new(scope, model, self, options)

    arbre do
      form(html_options) do
        extra_tags_for_form(html_options)
        instance_exec(builder, &block)
      end
    end
  end

  def extra_tags_for_form(*)
    super
  end

  def tag(name, options)
    content_tag(name, nil, options)
  end

  def content_tag(name, content, options, &block)
    tag = HelperTag.new(@context, name)

    arbre do
      tag.parent = current_arbre_element
      with_current_arbre_element tag do
        tag.build(options) do
          instance_exec(&block)
        end
      end
      current_arbre_element.add_child(tag)
    end
  end

  @@prop_names = []

  def self.render(&block)
    @@block = block
  end

  def self.properties(*props)
    @@prop_names = props
  end
end
