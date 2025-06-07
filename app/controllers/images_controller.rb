class ImagesController < ApplicationController
  # skip_before_action :require_login, raise: false

  def ogp
    base64_image = params[:image]  # html2canvasから送られたBase64データを受け取る
    send_data base64_image, type: "image/png", disposition: "inline"  # 画像データを直接返す
  end
end
