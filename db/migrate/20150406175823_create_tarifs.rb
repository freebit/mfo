class CreateTarifs < ActiveRecord::Migration
  def change
    create_table :tarifs do |t|
      t.string :type_t
      t.string :platform
      t.float :rate
      t.float :dop_rate
      t.float :minimum


      t.timestamps null: false
    end
      add_index :tarifs, [:type_t, :platform], unique: true
  end
end
