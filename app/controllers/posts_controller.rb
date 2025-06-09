class PostsController < ApplicationController
  ## 設定したprepare_meta_tagsをprivateにあってもpostコントローラー以外にも使えるようにする
  helper_method :prepare_meta_tags

  rescue_from ActiveRecord::RecordNotFound do |exception|
    redirect_to :root, alert: "無効なURLです"
  end

  def index
    # ログインしていた場合の処理
    if user_signed_in?
      # 検索状態かどうかで条件分岐
      if params[:q].present?
        # 検索フォームからアクセスされてる場合
        @search = Post.published.ransack(params[:q])
        if params[:q][:sorts] === "most_liked"
          @pagy, @posts = pagy(@search.result.most_liked)
        else
          @pagy, @posts = pagy(@search.result(distinct: true))
        end
      else
        params[:q] = { color_count_eq: "", sorts: "created_at desc" }
        @search = Post.published.ransack(params[:q])
        @pagy, @posts = pagy(@search.result(distinct: true))
        @search_status = false
      end
      @result_count = @search.result(distinct: true).count
    # ログイン前状態の処理
    else
      @posts = Post.joins(:user).where(users: { name: "Coloratio" }).published.latest.limit(10)
    end
  end

  def new
    @default_palette = [
      [ "#303967", "#e60012", "#ffe200" ],
      [ "#34485e", "#3c7d9b", "#5b9f8a" ],
      [ "#dcc58c", "#db3a09", "#478657" ],
      [ "#4f85a6", "#79a7d9", "#d8dbd9" ],
      [ "#7c2e1e", "#b19962", "#2a4743" ],
      [ "#eae4d1", "#6c8650", "#a87570" ],
      [ "#8b272b", "#e5006a" ],
      [ "#462e2e", "#cfaa2a" ],
      [ "#fff5e0", "#1a0b08" ],
      [ "#494544", "#c41a30", "#bac8c6" ]
    ].sample
    @post = Post.new
    # @existed_tags = Tag.pluck(:name) # Tagsテーブルの全てのtagを取得する場合
    # @existed_tags = Tag.joins(:tag_posts).distinct.pluck(:name) # 公開状態もしくは下書き状態のパレットに使用されてるtagのみ取得する場合
    @existed_tags = Tag.joins(:posts).where(posts: { status: "published" }).distinct.pluck(:name) # 公開状態状態パレットのtagのみ取得する場合
  end

  def create
    @post = Post.new(post_params)
    @post.color_count = params[:post][:ratio].split(",").length
    # tagを登録する用の処理
    input_tags = tag_params[:tag].split(",")
    @post.create_tags(input_tags) # create_tagsをtag.rbに記載。tagsテーブルのデータ作成と中間テーブルへの登録を行うためのメソッド。
    input_colors = color_params[:color].split(",")
    @post.create_colors(input_colors) # create_colorsをpost.rbにメソッド記載。colorテーブルの作成と中間テーブルへの登録を行うためのメソッド。
    if @post.save

      # タイトルが空の場合、デフォルト設定を施したい。
      if @post.title.blank?
        @post.update(title: "untitled-#{@post.id}")
      end

      if @post.status == "draft"
        redirect_to user_path(current_user, draft: true), notice: "下書きを保存しました。" # 作成が成功したら詳細ページへ移動する。
      else
        redirect_to post_path(@post), notice: "パレットを公開しました。"
      end
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @post = Post.find(params[:id])
    # 最新のカラー情報を取得して編集画面に渡したい。
    @palette_colors = @post.colors
    # noUiSlider用のratio変数を用意する。
    ratio = @post.ratio.split(",").map(&:to_i)
    @slider_range = create_slider_range(ratio)
    @existed_tags = Tag.joins(:posts).where(posts: { status: "published" }).distinct.pluck(:name)
    if @post.user == current_user
      render :edit
    else
      redirect_to posts_path, alert: "編集権限のないパレットです。"
    end
  end

  def update
    # 更新する@postを取得
    @post = Post.find(params[:id])
    ActiveRecord::Base.transaction do
      # @post.idを持つpost_colorsテーブルのデータを全て削除。
      ColorPost.where(post_id: @post.id).delete_all
      # 新しい色を登録する
      input_colors = color_params[:color].split(",")
      @post.create_colors(input_colors) # create_colorsをpost.rbにメソッド記載。colorテーブルの作成と中間テーブルへの登録を行うためのメソッド。
      # tag関連の更新も行っておく。
      input_tags = tag_params[:tag].split(",")
      # update_tagを呼び出してtagの更新を行う。
      @post.update_tags(input_tags)
      # フォームの入力内容を関連するカラムにセットする。
      @post.assign_attributes(post_params)
      # color_countも新しい値をセットしておく。
      @post.color_count = params[:post][:ratio].split(",").length
      # タイトルが未記入だった場合は、デフォルトのタイトルをセットしておく。
      @post.title = "untitled-#{@post.id}" if @post.title.blank?
      # 全てのセットが終わってから、最後にまとめてsaveメソッド使うことでデータに反映させる。
      if @post.save
        if @post.status == "draft"
          redirect_to user_path(current_user, draft: true), notice: "下書き情報を更新しました。" # 作成が成功したら詳細ページへ移動する。
        else
          redirect_to user_path(current_user, published: true), notice: "パレットを公開しました。"
        end
      else
        raise ActiveRecord::Rollback # saveまでうまくいかなかった時はロールバックを発生させる。
      end
    end
  rescue ActiveRecord::Rollback # ロールバックが起こった時の処理。
    render :edit, status: :unprocessable_entity
  end

  def show
    @post = Post.find(params[:id])
    @tags = @post.tags.pluck(:name)
    # 比率が大きい順に並んだhexコードの配列(デザイン例に使用)
    @sorted_colors = @post.colors.pluck(:hex_code).zip(@post.ratio.split(",").map(&:to_i)).sort_by { |i| -i[1] }.map(&:first)
    # prepare_meta_tags(@post)
    # respond_to do |format|
    #   format.turbo_stream
    #   format.html { render :show }
    # end
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

  def unpublished
    @post = Post.find(params[:id])
    if @post.update(status: "draft")
      redirect_to user_path(current_user, draft: true), notice: "下書きに戻しました"
    else
      redirect_to user_path(current_user), alert: "エラーが発生しました"
    end
  end

  private
  # paramsとは別にuser_idもこの時点で定義してパラメーターとして追加しておきたいからmergeを使用。
  # これでPost.newの時にuser_idも一緒に登録してくれる。
  def post_params # post関連のストロングパラメータ
    params.require(:post).permit(:title, :description, :ratio, :status).merge(user_id: current_user.id)
  end

  def color_params # color関連のストロングパラメータ
    params.require(:post).permit(:color)
  end

  def tag_params # tag用のストロングパラメータ
    params.require(:post).permit(:tag)
  end

  # edit時にnoUiSlider用の比率をjsに渡すための@slider_range定義用メソッド
  def create_slider_range(ratio)
    slider_range = [ 0 ]
    sum = 0
    ratio.each do |i|
      sum += i
      slider_range << sum
    end
    slider_range
  end

  # 動的OGP用のmeta_tags再定義メソッド(上端にてhelper_method :prepare_meta_tagsを指定してどこでも使えるようにしてる)
  def prepare_meta_tags(post)
    ## このimage_urlにMiniMagickで設定したOGPの生成した合成画像を代入する
    image_url = post.ogp_url.present? ? post.ogp_url : "#{request.base_url}/assets/palette.png"
    set_meta_tags og: {
                    title: "Coloratio",
                    description: "配色数も比率も自由自在。暮らしの中の「好き」から作る、自分だけのカラーパレット。",
                    type: "website",
                    url: request.original_url,
                    image: image_url,
                    locale: "ja-JP"
                  },
                  twitter: {
                    site: "Coloratio",
                    title: @post.title,
                    description: "配色数も比率も自由自在。暮らしの中の「好き」から作る、自分だけのカラーパレット。",
                    card: "summary_large_image",
                    image: image_url
                  }
  end
end
