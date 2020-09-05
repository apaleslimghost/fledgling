class ProjectPageComponent < ApplicationComponent
  properties :projects

  render do
    render ProjectListComponent.new(projects: @projects)
  end
end
