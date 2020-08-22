class AddColourToProject < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :colour, :string
  end
end
