class CreateOrders < ActiveRecord::Migration
  def change
    create_table :orders do |t|
      t.string :number
      t.string :number_mfo
      t.date :create_date
      t.float :summa
      t.date :submission_deadline
      t.string :number_data_protocol
      t.string :personal_number
      t.references :platform, index: true
      t.integer :guarantor_legal_id
      t.integer :guarantor_individual_id
      t.string :agent
      t.string :agent_name
      t.float :agent_summa
      t.string :status

      t.timestamps null: false
    end
    add_foreign_key :orders, :platforms

  end
end
