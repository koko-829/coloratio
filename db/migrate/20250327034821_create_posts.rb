class CreatePosts < ActiveRecord::Migration[7.2]
  def change
    create_table :posts do |t|
      t.string :title
      t.text :description
      t.integer :color_count
      t.integer :status
      t.integer :views_count
      t.references :user, foreign_key: true
      t.timestamps
    end
  end
end
