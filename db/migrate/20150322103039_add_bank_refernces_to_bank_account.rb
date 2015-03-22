class AddBankReferncesToBankAccount < ActiveRecord::Migration
  def change

    add_reference :banks, :bank_account, index: true

  end
end
