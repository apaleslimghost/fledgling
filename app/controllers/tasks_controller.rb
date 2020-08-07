class TasksController < ApplicationController
  def create
    @project = Project.find(params[:project_id])
    puts params
    @task = @project.tasks.create(params.require(:task).permit(:title))
    redirect_to project_path(@project)
  end
end
