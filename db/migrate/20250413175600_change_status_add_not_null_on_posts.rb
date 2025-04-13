class ChangeStatusAddNotNullOnPosts < ActiveRecord::Migration[7.2]
  def change
    change_column_null :posts, :status, false
  end
end
