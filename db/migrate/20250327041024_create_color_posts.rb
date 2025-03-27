class CreateColorPosts < ActiveRecord::Migration[7.2]
  def change
    create_table :color_posts do |t|
      t.references :color, null: false, foreign_key: true
      t.references :post, null: false, foreign_key: true

      t.timestamps

      t.index %i[color_id post_id], unique: true
    end
  end
end
