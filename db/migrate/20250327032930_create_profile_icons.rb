class CreateProfileIcons < ActiveRecord::Migration[7.2]
  def change
    create_table :profile_icons do |t|
      t.string :name
      t.text :svg_data
      t.timestamps
    end
  end
end
