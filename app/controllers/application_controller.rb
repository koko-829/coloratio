class ApplicationController < ActionController::Base
  before_action :check_maintenance_mode
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern
  include Pagy::Backend
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [ :name ])
  end

  private
  # メンテナンスモードにするための記載。
  # 環境変数'MAINTENANCE_MODE'が1の場合は/app/views/maintenance/maintenance.html.erbをレンダリングする
  # layout: nilにすることでヘッダーとかは表示しない感じにする。
  def check_maintenance_mode
    if ENV["MAINTENANCE_MODE"] == "1"
      render template: "maintenance/maintenance", status: :service_unavailable, layout: nil
    end
  end
end
