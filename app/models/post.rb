class Post < ApplicationRecord
  belongs_to :user
  has_many :likes, dependent: :destroy
  has_many :users, through: :likes
  has_many :color_posts, dependent: :destroy
  has_many :colors, through: :color_posts
  has_many :color_suggestions
  has_many :tag_posts, dependent: :destroy
  has_many :tags, through: :tag_posts
  enum :status, { draft: 0, published: 1 }
  validates :title, length: { maximum: 32 }
  validates :description, length: { maximum: 140 }

  scope :published, -> { where(status: "published") }
  scope :latest, -> { order(created_at: :desc) }
  scope :old, -> { order(created_at: :asc) }
  scope :updated, -> { order(updated_at: :desc) }
  scope :most_liked, -> { left_joins(:likes).group("posts.id").order("COUNT(likes.id) DESC") }

  def create_tags(input_tags)
    input_tags.each do |tag|
      new_tag = Tag.find_or_create_by(name: tag)
      tags << new_tag
    end
  end

  def self.ransackable_attributes(auth_object = nil)
    [ "title", "color_count", "created_at" ]
  end

  def self.ransackable_associations(auth_object = nil)
    [ "tags", "tag_posts", "color_posts", "colors" ]
  end

  def update_tags(input_tags)
    registered_tags = tags.pluck(:name)
    new_tags = input_tags - registered_tags
    destroy_tags = registered_tags - input_tags

    new_tags.each do |tag|
      new_tag = Tag.find_or_create_by(name: tag)
      tags << new_tag
    end

    destroy_tags.each do |tag|
      tag_id = Tag.find_by(name: tag)
      destroy_tag_post = TagPost.find_by(tag_id: tag_id, post_id: id)
      destroy_tag_post.destroy
    end
  end

  def create_colors(input_colors)
    input_colors.each do |color|
      new_color = Color.find_or_create_by(hex_code: color)
      colors << new_color
    end
  end

  def liked_by?(user)
    likes.exists?(user_id: user.id)
  end
end
