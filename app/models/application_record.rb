class ApplicationRecord < ActiveRecord::Base
  include Rails.application.routes.url_helpers

  self.abstract_class = true

  def include_methods
    []
  end

  def as_json(options = {})
    super(options.merge methods: [:_meta, *include_methods])
  end

  def form_method
    if persisted?
      'patch'
    else
      'post'
    end
  end

  def path_arguments
    [self]
  end

  def show_action
    if persisted?
      nil
    else
      :new
    end
  end

  def edit_action
    if persisted?
      :edit
    else
      :new
    end
  end

  def paths
    {
      action: polymorphic_path(path_arguments),
      show: polymorphic_path(path_arguments, action: show_action),
      edit: polymorphic_path(path_arguments, action: edit_action)
    }
  end

  def _meta
    {
      modelName: self.class.model_name.singular,
      urls: paths,
      method: form_method
    }
  end
end
