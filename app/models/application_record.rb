class ApplicationRecord < ActiveRecord::Base
  include Rails.application.routes.url_helpers
  # include ActionController::RequestForgeryProtection

  self.abstract_class = true

  def as_json(options = {})
    super(options.merge methods: :_meta)
  end

  def _meta
    {
      modelName: self.class.model_name.singular,
      url: polymorphic_path(self),
      method: if persisted? then 'patch' else 'post' end
    }
  end
end
