class Tag < ApplicationRecord
  has_many :tag_posts, dependent: :destroy
  has_many :posts, through: :tag_posts
end
