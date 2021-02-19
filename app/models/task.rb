class Task < ApplicationRecord
  alias_attribute :parent_id, :project_id

  def path_arguments
    [project, self]
  end

  def include_methods
    [:project]
  end
  def paths
    if persisted?
      super().merge({
                      move: move_project_task_path(project, self)
                    })
    else
      super
    end
  end

  belongs_to :project
end
