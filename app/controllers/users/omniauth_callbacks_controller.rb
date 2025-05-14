# frozen_string_literal: true

class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  skip_before_action :verify_authenticity_token, only: :google_oauth2

  def google_oauth2
    callback_for(:google)
  end

  def callback_for(provider)
    @user = User.from_omniauth(request.env["omniauth.auth"])

    if @user.persisted?
      sign_in_and_redirect @user, event: :authentication
      set_flash_message(:notice, :success, kind: provider.to_s.capitalize) if is_navigational_format?
    else
      session["devise.#{provider}_data"] = request.env["omniauth.auth"].except(:extra)
      set_flash_message(:alert, :failure, kind: provider.to_s.capitalize, reason: "既に他の方法で登録されているメールアドレスです") # flash[:alert]でt.devise.omniauth_callbacks.failureを呼び出す。
      redirect_to new_user_registration_url
    end
  end

  def failure
    redirect_to root_path
  end
end
