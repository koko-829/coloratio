# test/test_helper.rb

# 忘れずに追加
require "simplecov"

ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"
# テスト結果見やすくするためのプラグイン
require "minitest/reporters"
Minitest::Reporters.use!

require "minitest/autorun"

module ActiveSupport
  class TestCase
    # parallelizeはSimpleCovと互換性が悪いため、一旦コメントアウトする
    # parallelize(workers: :number_of_processors)

    fixtures :all
  end
end