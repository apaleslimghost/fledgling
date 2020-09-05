class ProjectCardComponent < ApplicationComponent
  properties :project

  render do
    link_to @project do
      h2 @project.title
    end
  end
end
