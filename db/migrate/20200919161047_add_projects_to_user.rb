class AddProjectsToUser < ActiveRecord::Migration[6.0]
  def change
    add_reference :users, :projects, foreign_key: true
  end
end
