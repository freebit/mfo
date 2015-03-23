class Organization < ActiveRecord::Base

  belongs_to :order

  has_one :applicant, class_name: 'Individual'
  has_one :bank_account
  has_one :founder

end
