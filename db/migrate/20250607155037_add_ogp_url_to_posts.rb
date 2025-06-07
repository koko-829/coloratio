class AddOgpUrlToPosts < ActiveRecord::Migration[7.2]
  def change
    add_column :posts, :ogp_url, :string
  end
end
