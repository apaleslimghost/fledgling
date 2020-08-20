class Task < ApplicationRecord
  def path_to
    polymorphic_path([project, self])
  end

  belongs_to :project
end
