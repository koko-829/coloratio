class TopController < ApplicationController
  def index
    # published、latestともにモデルでscope定義済み
    @posts = Post.joins(:user).where(users: { name: "Coloratio" }).published.latest.limit(10)
  end
end
