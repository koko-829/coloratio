module ApplicationHelper
  include Pagy::Frontend

  def default_meta_tags
    # if controller_name == "posts" && action_name == "show"
    #   # ここでポストのメタタグを設定する
    #   {
    #     site: "Coloratio",
    #     reverse: true,
    #     separator: "|",
    #     canonical: request.original_url,
    #     og: {
    #       title: @post.title,
    #       description: "このポストの説明文をここに入れる",
    #       url: request.original_url,
    #       image: image_url("ogp.png")
    #     },
    #     twitter: {
    #       card: "summary_large_image",
    #       image: image_url("ogp.png")
    #     }
    #   }
    # else
      # デフォルトのメタタグ
      {
        site: "Coloratio",
        reverse: true,
        separator: "|",
        canonical: request.original_url,
        og: default_og,
        twitter: default_twitter_card
      }
    # end
  end

  def my_post?(post)
    post.user_id == current_user.id
  end

  private

  def default_og
    {
      title: "デフォルトタイトル",
      description: "配色数も比率も自由自在。暮らしの中の「好き」から作る、自分だけのカラーパレット。",
      url: request.original_url,
      image: image_url("ogp.png")
    }
  end

  def default_twitter_card
    {
      card: "summary_large_image",
      image: image_url("ogp.png")
    }
  end
end
