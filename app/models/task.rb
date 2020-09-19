class Task < ApplicationRecord
  def path_arguments
    [project, self]
  end

  def include_methods
    [:project]
  end

  belongs_to :project
  has_and_belongs_to_many :dependencies,
                          class_name: 'Task',
                          join_table: :dependencies,
                          foreign_key: :from,
                          association_foreign_key: :to
end
