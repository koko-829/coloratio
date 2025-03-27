class Post < ApplicationRecord
	belongs_to :user
  has_many :likes
  has_many :users, through: :likes
  has_many :color_posts
  has_many :colors, through: :color_posts
  has_many :color_suggestions
  has_many :tag_posts
  has_many :tags, through: :tag_posts
end
