class Organization < ActiveRecord::Base

  belongs_to :order

  has_one :person, class_name: 'Individual'
  has_one :bank_account
  has_one :founder

  validates :type_o, presence: true
  validates :name, presence: true

end
