require "simplecov"

ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require_relative 'login_helper'
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