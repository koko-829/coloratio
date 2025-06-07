# app/controllers/ogp_creator.rb
class OgpCreator
  require "mini_magick"
  require "base64"

  BASE_IMAGE_PATH = "./app/assets/images/dynamic_ogp_base.png"
  GRAVITY = "center"

  def self.build_with_canvas(base64_image)
    # Base64データをデコードし、一時ファイルに保存
    image_data = base64_image.split(",")[1]
    decoded_image = Base64.decode64(image_data)
    File.open("./tmp/canvas_image.png", "wb") { |f| f.write(decoded_image) }

    # 背景画像と合成
    base_image = MiniMagick::Image.open(BASE_IMAGE_PATH)
    overlay_image = MiniMagick::Image.open("./tmp/canvas_image.png")

    # 合成処理
    base_image = base_image.composite(overlay_image) do |c|
      c.gravity GRAVITY
    end

    # 合成画像を保存
    output_path = "./output/combined_image.png"
    base_image.write(output_path)

    output_path
  end
end
