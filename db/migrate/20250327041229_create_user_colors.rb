class CreateUserColors < ActiveRecord::Migration[7.2]
  def change
    create_table :user_colors do |t|
      t.references :user, null: false, foreign_key: true
      t.references :color, null: false, foreign_key: true

      t.timestamps
    end
  end
end
