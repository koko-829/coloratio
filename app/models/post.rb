class Post < ApplicationRecord
  belongs_to :user
  has_many :likes
  has_many :users, through: :likes
  has_many :color_posts, dependent: :destroy
  has_many :colors, through: :color_posts
  has_many :color_suggestions
  has_many :tag_posts
  has_many :tags, through: :tag_posts
  enum status: { draft: 0, published: 1 }
  validates :title, length: { maximum: 16 }

  def create_colors(input_colors)
    input_colors.each do |color|
      # colorという名称のデータがすでにcolorカラムにある場合はそのまま、new_color変数に、もしまだ存在してなかった場合は、colorsテーブルに新しく作成した上でnew_color変数に格納する。
      new_color = Color.find_or_create_by(hex_code: color)
      # postのcolorsにnew_colorに代入したHEXコードを追加。つまり中間テーブルが一つ作成される。
      # @post.create_colors(input_colors)という感じでコントローラーで格納されるから、このcolorsは@post.colorsのことを指してる。
      colors << new_color
    end
  end
end
