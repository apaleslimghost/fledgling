class TasksController < ApplicationController
  def index
    @project = Project.find(params[:project_id])
    @tasks = @project.tasks
    render component: "Tasks", props: tasks_props(@tasks, @project)
  end

  def create
    @project = Project.find(params[:project_id])
    @task = @project.tasks.create(task_params)
    redirect_to project_path(@project)
  end

  def update
    @task = Task.find(params[:id])

    if @task.update(task_params)
      redirect_to params[:return_to] || @task.project
    end
  end

  private

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
end
