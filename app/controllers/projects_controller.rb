class ProjectsController < ApplicationController
  def index
    @projects = Project.roots
  end

  def new
    @project = Project.new
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
      render 'new'
    end
  end

  private def project_params
    params.require(:project).permit(:title, :description)
  end

  def show
    @project = Project.find(params[:id])
  end
end
