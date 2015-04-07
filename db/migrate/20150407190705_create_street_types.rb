class CreateStreetTypes < ActiveRecord::Migration
  def change
    create_table :street_types do |t|
      t.string :name
      t.string :code

      t.timestamps null: false
    end

    add_index :street_types, [:name, :code], unique: true
  end
end
