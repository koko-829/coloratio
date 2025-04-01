Rails.application.routes.draw do
  devise_for :users
  root to: "top#index"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # 静的ページ用ルーティング
  resource :static, only: [] do
    collection do
      get 'terms_of_service' #利用規約
      get 'privacy_policy' #プライバシーポリシー
      get 'contact' #お問い合わせ
      get 'about_app' #アプリの使い方ページ
    end
  end
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  # Defines the root path route ("/")
  # root "posts#index"
end
