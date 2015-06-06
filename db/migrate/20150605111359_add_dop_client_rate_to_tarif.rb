class AddDopClientRateToTarif < ActiveRecord::Migration
  def change
    add_column :tarifs, :client_dop_rate, :float
  end
end
