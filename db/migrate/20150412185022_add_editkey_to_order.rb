class AddEditkeyToOrder < ActiveRecord::Migration
  def change

    add_column :orders, :editkey, :string

  end
end
