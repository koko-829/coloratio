class UsersController < ApplicationController
  def show
    @user = User.find_by(id: params[:id]) # findにしてた場合、idが見つからなかったらエラーになってしまう。

    if @user.nil?
      redirect_to root_path, alert: "ユーザーが存在しません。"
      return
    end

    published_posts = Post.where(user_id: @user.id, status: "published")
    @my_page_published_posts = published_posts.limit(5)
    @published_count = published_posts.count
    draft_posts = Post.where(user_id: @user.id, status: "draft")
    @my_page_draft_posts = draft_posts.limit(5)
    @draft_count = draft_posts.count
  end
end
