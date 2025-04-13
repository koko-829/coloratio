class ChangeColumnToPosts < ActiveRecord::Migration[7.2]
  def change
    change_column_default(:posts, :status, 0)
  end
end
