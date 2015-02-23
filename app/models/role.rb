class Role < ActiveRecord::Base
  has_many :users_roles
  has_many :users, through: :users_roles


  validates :name, presence: true, uniqueness: true
  validates :title, presence: true

end
