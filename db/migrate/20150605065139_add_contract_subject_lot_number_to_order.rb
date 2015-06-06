class AddContractSubjectLotNumberToOrder < ActiveRecord::Migration
  def change
    add_column :orders, :contract_subject, :string
    add_column :orders, :lot_number, :string
  end
end
