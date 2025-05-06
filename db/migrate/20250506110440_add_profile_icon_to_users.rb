class AddProfileIconToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :profile_icon, :integer, default: 0
  end
end
