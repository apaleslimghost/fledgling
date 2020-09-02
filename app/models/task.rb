class Task < ApplicationRecord
  def path_to
    polymorphic_path([project, self])
  end

  def include_methods
    [:project]
  end

  belongs_to :project
end
