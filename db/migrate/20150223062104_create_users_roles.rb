class CreateUsersRoles < ActiveRecord::Migration
  def change
    create_table :users_roles do |t|
      t.references :role, index: true

      t.timestamps null: false
    end
    add_foreign_key :users_roles, :roles
  end
end
