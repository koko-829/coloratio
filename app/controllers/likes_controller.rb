class LikesController < ApplicationController
  def create
    @post = Post.find(params[:post_id])
    @like = current_user.likes.new(post_id: @post.id)
    respond_to do |format|
      if @like.save
        format.turbo_stream
        format.html { redirect_to request.referer, notice: "パレットをいいねしました" }
      else
        format.html { redirect_to request.referer, alert: "不具合により、パレットをいいねできませんでした" }
      end
    end
  end

  def destroy
    @post = Post.find(params[:post_id])
    @like = current_user.likes.find_by(post_id: @post.id)
    respond_to do |format|
      if @like.destroy
        format.turbo_stream
        format.html { redirect_to request.referer, notice: "パレットのいいねを外しました" }
      else
        format.html { redirect_to request.referer, alert: "不具合により、パレットのいいねを外せませんでした" }
      end
    end
  end
end
