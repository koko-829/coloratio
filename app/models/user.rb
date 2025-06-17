class User < ApplicationRecord
  has_many :posts, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :liked_posts, through: :likes, source: :post
  has_many :user_colors
  has_many :colors, through: :user_colors
  validates :profile_icon, numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: 17 }
  validates :name, uniqueness: true
  # 同じプロバイダー(Googleからとか)かつ同じuidからのログインの場合、ユーザーを新規作成できないようにする。
  validates :uid, presence: true, uniqueness: { scope: :provider }, if: -> { uid.present? }
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: [ :google_oauth2 ]

  # googleログイン時にユーザーネームとemailとpasswordを確認して、もしまだ存在してなかった場合は新しくユーザーを作成する用のメソッド
  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      proposed_name = auth.info.name

      if User.exists?(name: proposed_name)
        # 既存の名前がある場合は、デフォルト名をユーザーIDを使って設定
        user.name = "default-name-#{User.maximum(:id).to_i + 1}"
      else
        user.name = proposed_name
      end
      user.email = auth.info.email
      user.password = Devise.friendly_token[0, 20]
      user.profile_icon = rand(1..18)
    end
  end

  def self.create_unique_string
    SecureRandom.uuid
  end

  # パスワード無しで更新するためのメソッド。
  def update_without_current_password(params, *options)
    params.delete(:current_password)

    if params[:password].blank? && params[:password_confirmation].blank?
      params.delete(:password)
      params.delete(:password_confirmation)
    end

    result = update_attributes(params, *options)
    clean_up_passwords
    result
  end
end
