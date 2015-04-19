class AddToFounderTypeFColumn < ActiveRecord::Migration
  def change
    add_column :founders, :attachable_type, :string
  end

  # add_index :founders, :attachable_type
end
