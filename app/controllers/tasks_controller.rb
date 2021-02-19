class TasksController < ApplicationController
  before_action :check_project_access, only: [:index, :edit, :create, :update, :destroy, :move]
  before_action :check_task_exists, only: [:edit, :update, :destroy, :move]

  def check_project_access
    @project = Project.find(params[:project_id])

    not_found unless @project and current_user and @project.user == current_user
  end

  def check_task_exists
    not_found unless @project.tasks.exists?(params[:id])
    @task = Task.find(params[:id])
  end

  def index
    @tasks = @project.tasks
    render component: "Tasks", props: tasks_props(@tasks, @project)
  end

  def edit
    render component: "TaskEdit", props: { task: @task, project: @project, breadcrumbs: @project.breadcrumbs(include_self: true) }
  end

  def move
    render component: "ProjectTree", props: {
      tree: current_user.default_project.json_tree,
      project: @project,
      subject: @task,
      breadcrumbs: @project.breadcrumbs
    }
  end

  def create
    @task = @project.tasks.create(task_params)
    redirect_to project_path(@project)
  end

  def update
    if @task.update(task_params)
      redirect_to params[:return_to] || @task.project
    end
  end

  def destroy
    @task.destroy
    redirect_to project_tasks_path(@project)
  end

  private

  def not_found
    raise ActionController::RoutingError.new("Not Found")
  end

  def task_params
    params.require(:task).permit(:title, :completed, :parent_id)
  end

  def tasks_props(tasks, project)
    is_default_project = project == current_user.default_project

    base = {
      project: project,
      breadcrumbs: project.breadcrumbs(include_self: true),
    }

    if is_default_project
      base.merge({
                   tasks: project.hierarchy_tasks,
                   hierarchy_tasks: [],
                 })
    else
      base.merge({
                   tasks: tasks,
                   hierarchy_tasks: project.hierarchy_tasks(include_own: false),
                   new_task: Task.new(project: project),
                 })
    end
  end

  def wrapper_props(props)
    super.merge({ title: "#{props[:project].title} Tasks" })
  end
end
