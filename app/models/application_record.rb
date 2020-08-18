class ApplicationRecord < ActiveRecord::Base
  include Rails.application.routes.url_helpers

  self.abstract_class = true

  def as_json(options = {})
    super(options.merge methods: :_meta)
  end

  def _meta
    {
      model: self.class.model_name.singular,
      url: polymorphic_path(self)
    }
  end
end
