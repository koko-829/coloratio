class User < ApplicationRecord
  has_many :posts
  has_many :likes
  has_many :liked_posts, through: :likes, source: :post
  has_many :user_colors
  has_many :colors, through: :user_colors
  belongs_to :profile_icon
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
end
