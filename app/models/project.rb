class Project < ApplicationRecord
    has_many :tasks
    has_many :subprojects, class_name: :Project, foreign_key: :parent_id
    belongs_to :parent, class_name: :Project, optional: true
    validates :title, presence: true
	accepts_nested_attributes_for :parent
end
