class CreateRegions < ActiveRecord::Migration
  def change
    create_table :regions do |t|
      t.string :name
      t.string :code

      t.timestamps null: false
    end
    add_index :regions, [:name, :code], unique: true
  end
end
