class CreateAddresses < ActiveRecord::Migration
  def change
    create_table :addresses do |t|
      t.string :indx
      t.string :region
      t.string :raion
      t.string :punkt
      t.string :street_code
      t.string :street_name
      t.string :house
      t.string :corps
      t.string :building
      t.string :apart_number
      t.string :type_a

      t.references :organization, index: true
      t.references :individual, index: true

      t.timestamps null: false
    end
  end
end
