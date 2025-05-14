class ErrorsController < ApplicationController
  # レイアウトをerror.html.erbに変更(ヘッダーやフッター無しのレイアウト)
  layout "error"
  def not_found
    render status: 404
  end

  def internal_server_error
    render status: 500
  end
end
