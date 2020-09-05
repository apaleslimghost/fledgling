class ProjectFormComponent < ApplicationComponent
  properties :project

  render do
    form_with(model: @project) do |form|
      form.text_field :title
      form.submit
    end
  end
end
