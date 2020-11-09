class AddArchivedToProject < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :archived, :boolean, default: false
  end
end
