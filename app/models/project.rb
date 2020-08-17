class Project < ApplicationRecord
  has_many :tasks
  validates :title, presence: true
  has_closure_tree

  def hierarchy_tasks
    self_and_descendants.flat_map(&:tasks)
  end
end
