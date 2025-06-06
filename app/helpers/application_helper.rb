module ApplicationHelper
  include Pagy::Frontend
  def default_meta_tags
    {
      site: "Coloratio",
      reverse: true,
      separator: "|",
      canonical: request.original_url,
      og: default_og,
      twitter: default_twitter_card
    }
  end

  def my_post?(post)
    post.user_id == current_user.id
  end

  private

  def default_og
    {
      title: :full_title,          # :full_title とすると、サイトに表示される <title> と全く同じものを表示できる
      # description: :description,   # 上に同じ
      description: "配色数も比率も自由自在。暮らしの中の「好き」から作る、自分だけのカラーパレット。",
      url: request.original_url,
      image: image_url("ogp.png")
    }
  end

  def default_twitter_card
    {
      card: "summary_large_image", # または summary
      image: image_url("ogp.png")
      # site: '@hogehoge'            # twitter ID(必要ないかも)
    }
  end
end
