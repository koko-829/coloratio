class PostsController < ApplicationController
  def index
    unless user_signed_in?
      redirect_to top_index_path
      return
    end
    @pagy, @posts = pagy(Post.where(status: "published").order(created_at: :desc))
  end

  def new
    @default_palette = [
      [ "#303967", "#e60012", "#ffe200" ],
      [ "#34485e", "#3c7d9b", "#5b9f8a" ],
      [ "#dcc58c", "#db3a09", "#478657" ],
      [ "#4f85a6", "#79a7d9", "#d8dbd9" ],
      [ "#7c2e1e", "#b19962", "#2a4743" ],
      [ "#eae4d1", "#6c8650", "#a87570" ],
      [ "#b32425", "#fffde1", "#d6b845", "#150c15" ],
      [ "#150c15", "#9a1117", "#917c50", "#bbe3f5", "#da6a38" ],
      [ "#8b272b", "#e5006a" ],
      [ "#462e2e", "#cfaa2a" ],
      [ "#fff5e0", "#1a0b08" ],
      [ "#494544", "#c41a30", "#bac8c6" ]
    ].sample
    @post = Post.new
  end

  def create
    @post = Post.new(post_params)
    @post.color_count = params[:post][:ratio].split(",").length
    input_colors = color_params[:color].split(",")
    # input_colors = params[:post][:color].split(',') # colorの入力値を配列の形でinput_colorsに格納する。
    @post.create_colors(input_colors) # create_colorsをpost.rbにメソッド記載。colorテーブルの作成と中間テーブルへの登録を行うためのメソッド。
    if @post.save

      # タイトルが空の場合、デフォルト設定を施したい。
      if @post.title.blank?
        @post.update(title: "untitled-#{@post.id}")
      end

      if @post.status == "draft"
        redirect_to user_path(current_user), notice: "下書きを保存しました。" # 作成が成功したら詳細ページへ移動する。
      else
        redirect_to user_path(current_user), notice: "パレットを公開しました。"
      end
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @post = Post.find(params[:id])
  end

  def update
  end

  def show
    @post = Post.find(params[:id])
  end

  def destroy
    @post = Post.find(params[:id])
    if @post.user_id == current_user.id
      if @post.destroy
        redirect_to user_path(current_user), notice: "削除が完了しました"
      else
        redirect_to user_path(current_user), alert: "削除に失敗しました"
      end
    end
  end

  private
  # paramsとは別にuser_idもこの時点で定義してパラメーターとして追加しておきたいからmergeを使用。
  # これでPost.newの時にuser_idも一緒に登録してくれる。
  def post_params # post関連のストロングパラメータ
    params.require(:post).permit(:title, :ratio, :status).merge(user_id: current_user.id)
  end

  def color_params # color関連のストロングパラメータ
    params.require(:post).permit(:color)
  end
end
