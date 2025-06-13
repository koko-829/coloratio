class AddColorListToPosts < ActiveRecord::Migration[7.2]
  def change
    add_column :posts, :color_list, :string
  end
end
