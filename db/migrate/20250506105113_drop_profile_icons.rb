class DropProfileIcons < ActiveRecord::Migration[7.2]
  def change
    remove_foreign_key :users, :profile_icons # 外部キー削除
    remove_index :users, :profile_icon_id # インデックス削除
    remove_column :users, :profile_icon_id, :bigint # カラム削除
    drop_table :profile_icons # テーブル削除
  end
end
