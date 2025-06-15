Rails.application.routes.draw do
  mount RailsAdmin::Engine => "/admin", as: "rails_admin"
  devise_for :users, controllers: {
    registrations: "users/registrations",
    sessions: "users/sessions",
    passwords: "users/passwords",
    confirmations: "users/confirmations",
    omniauth_callbacks: "users/omniauth_callbacks"
  }

  resources :users, only: [ :show ]

  root to: "posts#index"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # postsコントローラーのルーティング
  resources :posts do
    # 同じユーザーが1つの投稿に何度もいいねすることはできないようにしたいので、resourceでネスト。
    resource :likes, only: %i[create destroy]
    member do
      post "unpublished"
    end
  end

  # 静的ページ用ルーティング
  resource :static, only: [] do
    collection do
      get "terms_of_service" # 利用規約
      get "privacy_policy" # プライバシーポリシー
      get "contact" # お問い合わせ
      get "about_app" # アプリについてページ
      get "practice" # デザイン確認用ページ(開発用。全て終わったら削除する)
    end
  end

  # images/upload用のアクションルーティング
  post "images/upload", to: "images#upload", as: "images_upload"

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  # カスタムエラーページ用のルート
  get "/404", to: "errors#not_found", as: :not_found
  get "/500", to: "errors#internal_server_error", as: :internal_server_error

  # すべての未知のルートを404エラーページへリダイレクト
  match "*path", to: "errors#not_found", via: :all
end
