class AddRatioToPosts < ActiveRecord::Migration[7.2]
  def change
    add_column :posts, :ratio, :string, null: false
  end
end
