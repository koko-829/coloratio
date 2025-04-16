class TopController < ApplicationController
  def index
    @posts = Post.where(status: "published").order(created_at: :desc).limit(10)
  end
end
