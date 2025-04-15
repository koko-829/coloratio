class TopController < ApplicationController
  def index
    @posts = Post.where(status: "published").limit(10)
  end
end
