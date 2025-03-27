class CreateColorSuggestions < ActiveRecord::Migration[7.2]
  def change
    create_table :color_suggestions do |t|
      t.string :color_combination
      t.references :post, null: false, foreign_key: true
      t.timestamps
    end
  end
end
