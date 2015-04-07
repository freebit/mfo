class CreateOrders < ActiveRecord::Migration
  def change
    create_table :orders do |t|
      t.string :platform
      t.string :number
      t.string :number_mfo
      t.date :create_date
      t.float :summa
      t.date :submission_deadline
      t.string :number_data_protocol
      t.string :personal_number
      t.string :agent
      t.string :agent_name
      t.float :agent_summa
      t.float :dogovor_summa
      t.float :mfo_summa
      t.string :status

      t.timestamps null: false
    end

  end
end
