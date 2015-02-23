class AddUserRefsToUsersRoles < ActiveRecord::Migration
  def change
    add_reference :users_roles, :user, index: true
    add_foreign_key :users_roles, :users
  end
end
