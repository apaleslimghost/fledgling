class Task < ApplicationRecord
  def path_arguments
    [project, self]
  end

  def include_methods
    [:project]
  end

  belongs_to :project
end
