class Color < ApplicationRecord
  has_many :color_posts
  has_many :posts, through: :color_posts
  has_many :user_colors
  has_many :users, through: :user_colors
end
