class User < ActiveRecord::Base
  has_many :users_roles
  has_many :roles, through: :users_roles
end
