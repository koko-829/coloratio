module ApplicationHelper
  include Pagy::Frontend

  def default_meta_tags
    # デフォルトのメタタグ
    {
      site: "Coloratio",
      title: "Coloratio",
      reverse: true,
      separator: "|",
      charset: "utf-8",
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
      title: "Coloratio",
      description: "配色数も比率も自由自在。暮らしの中の「好き」から作る、自分だけのカラーパレット。",
      url: request.original_url,
      image: image_url("ogp.png")
    }
  end

  def default_twitter_card
    {
      title: "Coloratio",
      description: "配色数も比率も自由自在。暮らしの中の「好き」から作る、自分だけのカラーパレット。",
      card: "summary_large_image",
      image: image_url("ogp.png")
    }
  end

  # def posts_og
  #   {
  #     title: @post.title,
  #     description: "ポスト投稿用のOG情報",
  #     url: request.original_url,
  #     image: @post.ogp_url.presence || image_url("ogp.png")
  #   }
  # end

  # def posts_twitter_card
  #   {
  #     title: "post投稿",
  #     description: "ポスト投稿用のOG",
  #     card: "summary_large_image",
  #     # image: @post.ogp_url.presence || image_url("ogp.png")
  #     image: image_url("palette.png")
  #   }
  # end
end
