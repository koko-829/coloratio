class UserColor < ApplicationRecord
  belongs_to :user
  belongs_to :color
end
