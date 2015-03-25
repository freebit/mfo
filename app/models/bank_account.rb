class BankAccount < ActiveRecord::Base
  belongs_to :organization
  has_one :bank

  accepts_nested_attributes_for :bank

  validates :account_number, presence: true

end
