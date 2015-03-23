class BankAccount < ActiveRecord::Base
  belongs_to :organization
  has_one :bank

end
