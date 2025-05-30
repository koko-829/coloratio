class Color < ApplicationRecord
  has_many :color_posts, dependent: :destroy
  has_many :posts, through: :color_posts
  has_many :user_colors
  has_many :users, through: :user_colors

  def self.ransackable_attributes(auth_object = nil)
    [ "hex_code" ]
  end
end
