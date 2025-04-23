class LikesController < ApplicationController
  def create
    @post = Post.find(params[:post_id])
    @like = current_user.likes.new(post_id: @post.id)
    if @like.save
      redirect_to request.referer, notice: "パレットをいいねしました"
    else
      redirect_to request.referer, alert: "不具合により、パレットをいいねできませんでした"
    end
  end

  def destroy
    @post = Post.find(params[:post_id])
    @like = current_user.likes.find_by(post_id: @post.id)
    if @like.destroy
      redirect_to request.referer, notice: "パレットのいいねを外しました"
    else
      redirect_to request.referer, alert: "不具合により、パレットのいいねを外せませんでした"
    end
  end
end
