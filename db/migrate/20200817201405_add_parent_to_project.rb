class AddParentToProject < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :parent_id, :integer
  end
end
