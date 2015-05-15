class RemoveForeignKeyUsersRoles < ActiveRecord::Migration
  def change
    remove_foreign_key :users_roles, :user
  end
end
