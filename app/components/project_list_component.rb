class ProjectListComponent < ApplicationComponent
  properties :projects

  render do
    div do
      @projects.each do |project|
        render ProjectCardComponent.new(
                 project: project
               )
      end

      render ProjectCardComponent.new(project: Project.new(title: 'New project...'))
    end
  end
end
