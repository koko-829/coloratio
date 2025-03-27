class CreateTagPosts < ActiveRecord::Migration[7.2]
  def change
    create_table :tag_posts do |t|
      t.references :tag, null: false, foreign_key: true
      t.references :post, null: false, foreign_key: true

      t.timestamps

      t.index %i[tag_id post_id], unique: true
    end
  end
end
