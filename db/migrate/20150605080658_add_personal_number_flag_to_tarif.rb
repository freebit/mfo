class AddPersonalNumberFlagToTarif < ActiveRecord::Migration
  def change
    add_column :tarifs, :personal_number_flag, :boolean
  end
end
