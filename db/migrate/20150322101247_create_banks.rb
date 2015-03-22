class CreateBanks < ActiveRecord::Migration
  def change
    create_table :banks do |t|
      t.string :name
      t.string :korr_number
      t.string :bik
      t.string :inn
      t.string :city
      t.string :address

      t.timestamps null: false
    end
  end
end
