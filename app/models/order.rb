class Order < ActiveRecord::Base

  has_one :borrower, ->{ where attachable_type: 'borrower'}, class_name: 'Organization', dependent: :destroy
  has_one :guarantor_legal, ->{ where attachable_type: 'guarantor_legal'}, class_name: 'Organization', dependent: :destroy
  has_one :guarantor_individual, class_name: 'Individual', dependent: :destroy

  has_many :documents, dependent: :destroy

  has_attached_files


  accepts_nested_attributes_for :borrower, allow_destroy: true
  accepts_nested_attributes_for :guarantor_legal, allow_destroy: true
  accepts_nested_attributes_for :guarantor_individual, allow_destroy: true

  attr_accessor :documents_attributes
  accepts_nested_attributes_for :documents, allow_destroy: true



  #attr_accessor :guarantor_individual_attributes

  validates :summa, presence: true, numericality: {greater_than: 0}
  validates :platform, presence: true
  validates :submission_deadline, presence: true
  validates :agent, presence: true
  validates :agent_name, presence: true
  validates :agent_summa, presence: true
  validates :number, presence: true
  validates :number_mfo, presence: true
  validates :number_data_protocol, presence: true
  validates :personal_number, presence: true
  validates :create_date, presence: true
  validates :status, presence: true


  #validates :status, presence: true



end
