class Order < ActiveRecord::Base
  has_one :platform

  has_one :borrower, class_name: 'Organization'
  has_one :guarantor_legal, class_name: 'Organization'

  has_one :guarantor_individual, class_name: 'Individual'

  validates :summa, presence: true
  validates :status, presence: true

end
