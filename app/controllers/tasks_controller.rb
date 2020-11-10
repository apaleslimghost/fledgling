class TasksController < ApplicationController
  before_action :check_project_access, only: [:index, :create, :update, :destroy]

  def check_project_access
    @project = Project.find(params[:project_id])

    not_found unless @project and current_user and @project.user == current_user
  end

  def index
    @tasks = @project.tasks
    render component: "Tasks", props: tasks_props(@tasks, @project)
  end

  def create
    @task = @project.tasks.create(task_params)
    redirect_to project_path(@project)
  end

  def update
    not_found unless @project.tasks.exists?(params[:id])

    @task = Task.find(params[:id])

    if @task.update(task_params)
      redirect_to params[:return_to] || @task.project
    end
  end

  def destroy
    not_found unless @project.tasks.exists?(params[:id])

    Task.destroy(params[:id])
    redirect_to project_tasks_path(@project)
  end

  private

  def not_found
    raise ActionController::RoutingError.new("Not Found")
  end

  def task_params
    params.require(:task).permit(:title, :completed)
  end

  def tasks_props(tasks, project)
    {
      tasks: tasks,
      project: project,
      breadcrumbs: project.breadcrumbs(include_self: true),
      new_task: Task.new(project: project),
    }
  end

  def wrapper_props(props)
    super.merge({ title: "#{props[:project].title} Tasks" })
  end
end
