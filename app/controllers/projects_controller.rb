class ProjectsController < ApplicationController
  def index
    project = Project.new(
      title: 'Projects',
      children: Project.roots
    )

    render component: 'Project', props: project_props(project)
  end

  def show
    project = Project.find(params[:id])
    props = project_props(project).merge({
                                           new_task: Task.new(project: project),
                                           breadcrumbs: project.breadcrumbs,
                                         })
    
    render component: 'Project', props: props
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

  private

  def project_params
    params.require(:project).permit(:title, :description)
  end

  def project_props(project)
    {
      project: project,
      children: project.children,
      tasks: project.hierarchy_tasks,
      subproject: Project.new(parent: project.persisted? ? project : nil, title: 'New project…')
    }
  end
end
