class ImagesController < ApplicationController
  # skip_before_action :require_login, raise: false

  def upload
    base64_image = params[:image_data]

    image_data = base64_image.sub(/^data:image\/(png|jpg|jpeg);base64,/, "")
    decoded_image = Base64.decode64(image_data)

    # Cloudinaryにアップロード
    result = Cloudinary::Uploader.upload(
      StringIO.new(decoded_image),
      resource_type: :image,
      public_id: params[:post_id],
      transformation: { width: 1200, height: 630, crop: :limit }
      )

    @image_url = result["secure_url"]  # HTTPS形式のURLを取得

    # Postモデルを更新
    @upload_post = Post.find(params[:post_id])
    @upload_post.update(ogp_url: @image_url)

    respond_to do |format|
      format.turbo_stream
      format.html { redirect_to root_path }
    end
  end
end
