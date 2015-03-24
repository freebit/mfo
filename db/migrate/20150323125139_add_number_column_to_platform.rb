class AddNumberColumnToPlatform < ActiveRecord::Migration
  def change
    add_column :platforms, :number, :string
  end
end
