class AddProfileIconIdToUsers < ActiveRecord::Migration[7.2]
  def change
    add_reference :users, :profile_icon, foreign_key: true
  end
end
