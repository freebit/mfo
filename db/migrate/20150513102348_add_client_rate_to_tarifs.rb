class AddClientRateToTarifs < ActiveRecord::Migration
  def change
    add_column :tarifs, :client_rate, :float
  end
end
