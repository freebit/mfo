class CreateDocuments < ActiveRecord::Migration
  def change
    create_table :documents do |t|
      t.string :type_d
      t.string :path
      t.references :orders, index: true

      t.timestamps null: false
    end
    #add_foreign_key :documents, :orders
  end
end
