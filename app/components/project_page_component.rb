class ProjectPageComponent < ApplicationComponent
  properties :projects

  render do
    ul do
      @projects.each do |project|
        li link_to project.title, project
      end
    end
  end
end
