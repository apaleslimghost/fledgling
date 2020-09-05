class ProjectsController < ApplicationController
  def index
    render_component ProjectPageComponent.new(projects: Project.roots)
  end

  def new
    render component: 'ProjectForm', props: { project: Project.new }
  end

  def edit
    render component: 'ProjectForm', props: { project: Project.find(params[:id]) }
  end

  def create
    if params[:project_id]
      parent = Project.find(params[:project_id])
      @project = parent.children.new(project_params)
    else
      @project = Project.new(project_params)
    end

    if @project.save
      redirect_to @project
    else
      # TODO render form with errors
      render 'new'
    end
  end

  def update
    @project = Project.find(params[:id])

    if @project.update(project_params)
      redirect_to @project
    else
      # TODO render form with errors
    end
  end

  private def project_params
    params.require(:project).permit(:title, :description)
  end

  def show
    @project = Project.find(params[:id])
    render component: 'Project', props: {
             project: @project,
             new_project: Project.new(title: 'New project…'),
             children: @project.children,
             tasks: @project.hierarchy_tasks,
             breadcrumbs: @project.breadcrumbs,
             new_task: Task.new(project: @project),
             subproject: Project.new(parent: @project)
           }
  end
end
