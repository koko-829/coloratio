class TopController < ApplicationController
  def index
    # ログイン状態で「ログイン前トップページ」を表示できないようにするための処理。
    if user_signed_in?
      redirect_to :root
      return
    end
    # published、latestともにモデルでscope定義済み
    @posts = Post.joins(:user).where(users: { name: "Coloratio" }).published.latest.limit(10)
  end
end
