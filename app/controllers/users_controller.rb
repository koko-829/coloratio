class UsersController < ApplicationController
  def show
    @user = User.find_by(id: params[:id]) # findにしてた場合、idが見つからなかったらエラーになってしまう。

    if @user.nil?
      redirect_to root_path, alert: "ユーザーが存在しません。"
      return
    end

    if @user.id == current_user.id # 自分のアカウントだった場合
      published_posts = Post.where(user_id: @user.id, status: "published").latest
      draft_posts = Post.where(user_id: @user.id, status: "draft").latest
      liked_posts = @user.liked_posts

      # 各パレット数取得
      @published_count = published_posts.count
      @draft_count = draft_posts.count
      @liked_count = liked_posts.count

      # 各パレット表示用
      if params[:published]
        @pagy, @my_published_posts = pagy(published_posts, limit: 4)
        @selected_tab = "published"
      elsif params[:draft]
        @pagy, @draft_posts = pagy(draft_posts, limit: 4)
        @selected_tab = "draft"
      elsif params[:liked]
        @pagy, @liked_posts = pagy(liked_posts, limit: 4)
        @selected_tab = "liked"
      else
        @pagy, @my_published_posts = pagy(published_posts, limit: 4)
        @selected_tab = "published"
      end

    else # 他のユーザーだった場合
      published_posts = Post.where(user_id: @user.id, status: "published").latest
      @pagy, @published_posts  = pagy(published_posts)
    end
  end
end
