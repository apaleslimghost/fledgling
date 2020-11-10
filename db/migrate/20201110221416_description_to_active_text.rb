class DescriptionToActiveText < ActiveRecord::Migration[6.0]
  include ActionView::Helpers::TextHelper

  def change
    rename_column :projects, :description, :description_old
    Project.find_each do |project|
      project.update_attribute(:description, simple_format(project.description_old))
    end
    remove_column :projects, :description_old
  end
end
