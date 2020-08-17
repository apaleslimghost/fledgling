class ProjectsController < ApplicationController
  def index
    @projects = Project.all
  end

  def new
    @project = Project.new
  end

  def create
    @project = Project.new(project_params)

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
