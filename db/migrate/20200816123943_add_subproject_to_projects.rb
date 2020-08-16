class AddSubprojectToProjects < ActiveRecord::Migration[6.0]
  def change
    add_reference :projects, :parent, index: true
  end
end
