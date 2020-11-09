class ProjectsController < ApplicationController
  before_action :check_project_access, only: [:show, :edit, :update]

  def check_project_access
    @project = Project.find(params[:id])

    if not @project or not current_user or @project.user != current_user
      raise ActionController::RoutingError.new("Not Found")
    end
  end

  def index
    if current_user
      redirect_to current_user.default_project
    else
      redirect_to login_path
    end
  end

  def show
    render component: "Project", props: project_props(@project)
  end

  def new
    props = project_props(create_project)
    render component: "ProjectForm", props: props
  end

  def edit
    render component: "ProjectForm", props: project_props(@project)
  end

  def create
    project = create_project(**project_params)

    if project.save
      redirect_to project
    else
      # TODO render form with errors
    end
  end

  def update
    if @project.update(project_params)
      redirect_to @project
    else
      # TODO render form with errors
    end
  end

  private

  def create_project(**attrs)
    if params[:project_id]
      parent = Project.find(params[:project_id])
      parent.children.new(**attrs)
    else
      Project.new(**attrs)
    end
  end

  def project_params
    params.require(:project).permit(:title, :description).merge(user: current_user)
  end

  def project_props(project)
    is_default_project = project == current_user.default_project

    subproject = Project.new(
      parent: project.persisted? ? project : nil,
      title: is_default_project ? "New project…" : "Add subproject…",
      colour: project.colour,
    )

    {
      project: project,
      children: project.children.where(archived: false),
      subproject: subproject,
      is_default_project: is_default_project,
      tasks: project.hierarchy_tasks,
      breadcrumbs: project.breadcrumbs,
      new_task: (Task.new(project: project) unless is_default_project or not project.persisted?),
    }
  end

  def wrapper_props(props)
    super.merge({ title: props[:project].title })
  end
end
