class CreateIndividuals < ActiveRecord::Migration
  def change
    create_table :individuals do |t|
      t.string :fullname
      t.date :birthday
      t.string :pass_serial_number
      t.date :pass_issue_date
      t.string :pass_issued
      t.string :pass_issued_code
      t.string :old_pass_serial_number
      t.date :old_pass_issue_date
      t.string :old_pass_issued
      t.string :old_pass_issued_code
      t.string :citizenship
      t.string :phone
      t.string :email

      t.references :organization, index: true
      t.references :order, index: true

      t.timestamps null: false

    end


  end
end
