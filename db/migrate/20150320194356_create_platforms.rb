class CreatePlatforms < ActiveRecord::Migration
  def change
    create_table :platforms do |t|
      t.string :name
      t.float :rate_1
      t.float :rate_2
      t.float :ast_rate_1
      t.float :ast_rate_2
      t.float :max
      t.float :min
      t.boolean :active

      t.timestamps null: false
    end
  end
end
