class Bank < ActiveRecord::Base

  belongs_to :bank_account

  attr_accessor :_destroy

  #validates :name, presence: true
  #validates :korr_number, presence: true
  #validates :bik, presence: true
  #validates :inn, presence: true
  #validates :city, presence: true
  #validates :address, presence: true

end
