class Organization < ActiveRecord::Base

  attr_accessor :_destroy
  attr_accessor :skip_kpp_validation

  belongs_to :order

  has_one :person, class_name: 'Individual', dependent: :destroy
  has_one :bank_account, dependent: :destroy
  has_one :founder, dependent: :destroy

  accepts_nested_attributes_for :person, allow_destroy: true
  accepts_nested_attributes_for :bank_account, allow_destroy: true
  accepts_nested_attributes_for :founder, allow_destroy: true


  # validates :type_o, presence: true
  # validates :inn, presence: true
  #
  # validates :kpp, presence: true, unless: :skip_kpp_validation
  #
  #
  # validates :name, presence: true
  # validates :fullname, presence: true
  #
  # validates :ogrn, presence: true
  # validates :address_legal, presence: true
  # validates :address_actual, presence: true
  # validates :head_position, presence: true
  # validates :reg_date, presence: true

end
