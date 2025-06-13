class StaticsController < ApplicationController
  def terms_of_service
  end

  def privacy_policy
  end

  def contact
  end

  def about_app
  end

  def practice
  end

  def colors_update
    post_id = params[:post_id]
    @post = Post.find_by(id: post_id)
    if @post
      @colors = @post.colors.pluck(:hex_code)
      @post.update(color_list: @colors.join(","))
      flash[:notice] = "#{@post.color_list}"
    else
      flash[:alert] = "#{post_id}のpostが見つかりませんでした"
    end
    redirect_to practice_static_path
  end
end
