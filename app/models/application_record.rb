class ApplicationRecord < ActiveRecord::Base
  include Rails.application.routes.url_helpers

  self.abstract_class = true

  def as_json(options = {})
    super(options.merge methods: [:_meta])
  end

  def form_method
    if persisted?
      'patch'
    else
      'post'
    end
  end

  def path_to
    polymorphic_path(self)
  end

  def _meta
    {
      modelName: self.class.model_name.singular,
      url: path_to,
      method: form_method
    }
  end
end
