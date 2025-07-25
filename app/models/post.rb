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

  scope :published, -> { where(status: "published") } # 投稿済みのみを絞り込む用。
  scope :latest, -> { order(created_at: :desc) } # 公開が新しい順
  scope :old, -> { order(created_at: :asc) } # 公開が古い順
  scope :updated, -> { order(updated_at: :desc) } # 更新が新しい順
  scope :most_liked, -> { left_joins(:likes).group("posts.id").order("COUNT(likes.id) DESC") }

  # tags登録のためのメソッド
  def create_tags(input_tags)
    input_tags.each do |tag|
      new_tag = Tag.find_or_create_by(name: tag)
      tags << new_tag
    end
  end

  # ransackの検索用。
  def self.ransackable_attributes(auth_object = nil)
    [ "title", "color_count", "created_at" ]
  end

  def self.ransackable_associations(auth_object = nil)
    [ "tags", "tag_posts", "color_posts", "colors" ]
  end

  # tagsの更新のためのメソッド
  def update_tags(input_tags)
    registered_tags = tags.pluck(:name) # すでに紐付けれらているタグを配列化する
    new_tags = input_tags - registered_tags # 追加されたタグ
    destroy_tags = registered_tags - input_tags # 削除されたタグ

    new_tags.each do |tag| # 新しいタグをモデルに追加
      new_tag = Tag.find_or_create_by(name: tag)
      tags << new_tag
    end

    destroy_tags.each do |tag| # 削除されたタグを中間テーブルから削除
      tag_id = Tag.find_by(name: tag)
      destroy_tag_post = TagPost.find_by(tag_id: tag_id, post_id: id)
      destroy_tag_post.destroy
    end
  end

  # colors登録のためのメソッド
  def create_colors(input_colors)
    input_colors.each do |color|
      # colorという名称のデータがすでにcolorカラムにある場合はそのまま、new_color変数に、もしまだ存在してなかった場合は、colorsテーブルに新しく作成した上でnew_color変数に格納する。
      new_color = Color.find_or_create_by(hex_code: color)
      # postのcolorsにnew_colorに代入したHEXコードを追加。つまり中間テーブルが一つ作成される。
      # @post.create_colors(input_colors)という感じでコントローラーで格納されるから、このcolorsは@post.colorsのことを指してる。
      colors << new_color
    end
  end

  def liked_by?(user)
    likes.exists?(user_id: user.id)
  end
end
