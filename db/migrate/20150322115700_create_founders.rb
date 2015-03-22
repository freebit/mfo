class CreateFounders < ActiveRecord::Migration
  def change
    create_table :founders do |t|
      t.string :name
      t.float :share
      t.string :pass_data_ogrn
      t.references :organization, index: true

      t.timestamps null: false
    end
    add_foreign_key :founders, :organizations
  end
end
