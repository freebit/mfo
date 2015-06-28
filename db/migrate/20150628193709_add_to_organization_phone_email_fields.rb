class AddToOrganizationPhoneEmailFields < ActiveRecord::Migration
  def change
    add_column :organizations, :email, :string
    add_column :organizations, :phone, :string
  end
end
