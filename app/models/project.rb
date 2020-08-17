class Project < ApplicationRecord
  has_many :tasks
  validates :title, presence: true
  has_closure_tree
end
