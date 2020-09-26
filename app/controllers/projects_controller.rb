class ProjectsController < ApplicationController
  # TODO enforce ownership/user presence

  def index
    if current_user
      redirect_to current_user.default_project
    else
      redirect_to login_path
    end
  end

  def show
    project = Project.find(params[:id])
    props = project_props(project)

    render component: 'Project', props: props
  end

  def new
    project = if params[:project_id]
                parent = Project.find(params[:project_id])
                parent.children.new
              else
                Project.new
              end

    render component: 'ProjectForm', props: { project: project }
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

  private

  def project_params
    params.require(:project).permit(:title, :description).merge(user: current_user)
  end

  def project_props(project)
    is_default_project = project == current_user.default_project

    {
      project: project,
      children: project.children,
      tasks: project.hierarchy_tasks,
      subproject: Project.new(parent: project.persisted? ? project : nil, title: 'New project…'),
      **(if is_default_project then {} else {
        new_task: Task.new(project: project),
        breadcrumbs: project.breadcrumbs,
      } end)
    }
  end
end
