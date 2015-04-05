class BankAccount < ActiveRecord::Base
  belongs_to :organization

  has_one :bank, dependent: :destroy

  accepts_nested_attributes_for :bank, allow_destroy: true

  attr_accessor :_destroy

  #validates :account_number, presence: true

end
