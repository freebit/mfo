class AddToOrderNumberMmvbField < ActiveRecord::Migration
  def change
    add_column :orders, :number_mmvb, :string
  end
end
