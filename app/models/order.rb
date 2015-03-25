class Order < ActiveRecord::Base

  has_one :borrower, ->{ where attachable_type: 'borrower'}, class_name: 'Organization', dependent: :destroy
  has_one :guarantor_legal, ->{ where attachable_type: 'guarantor_legal'}, class_name: 'Organization', dependent: :destroy
  has_one :guarantor_individual, class_name: 'Individual', dependent: :destroy

  has_many :documents, dependent: :destroy

  accepts_nested_attributes_for :borrower
  accepts_nested_attributes_for :guarantor_legal
  accepts_nested_attributes_for :guarantor_individual

  accepts_nested_attributes_for :documents

  validates :summa, presence: true, numericality: {greater_than: 0}
  validates :platform, presence: true

  #validates :status, presence: true



end
