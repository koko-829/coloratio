class TopController < ApplicationController
  def index
    # published、latestともにモデルでscope定義済み
    @posts = Post.published.latest.limit(10)
  end
end
