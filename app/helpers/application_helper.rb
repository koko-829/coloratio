module ApplicationHelper
  include Pagy::Frontend
  def default_meta_tags
    {
      site: "Coloratio",
      reverse: true,
      separator: "|",
      canonical: "https://coloratio-app.com/",
      og: default_og,
      twitter: default_twitter_card
    }
  end

  private

  def default_og
    {
      title: :full_title,          # :full_title とすると、サイトに表示される <title> と全く同じものを表示できる
      # description: :description,   # 上に同じ
      description: "'好き'から見つけるぴったり配色。あなたの目に映る世界を色だけで表現してみるカラーパレットアプリ",
      url: "https://coloratio-app.com/",
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
