class ChangeViewsCountDefaultToPosts < ActiveRecord::Migration[7.2]
  def change
    change_column_default :posts, :views_count, 0
  end
end
