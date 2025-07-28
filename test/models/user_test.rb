require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "valid user" do
    user = users(:taro)
    assert user.valid?
  end

  # emailが空の場合に無効となるか？
  test "invalid without email" do
    user = User.new(email: nil)
    assert_not user.valid?
  end

  # encrypted_passwordが存在しない場合に無効となるか？
  # 既存メールアドレスでユーザー作成しようとした際にエラーが起こるかどうか？
  # 同じ名前でユーザー作成ができないようになっているかどうか?
  # profile_iconのバリデーションを超える整数の場合に無効となるか？
end
