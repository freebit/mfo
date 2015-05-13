class Organization < ActiveRecord::Base

  belongs_to :order

  attr_accessor :_destroy
  attr_accessor :skip_kpp_validation


  has_one :person, class_name: 'Individual', dependent: :destroy
  has_one :bank_account, dependent: :destroy

  has_many :founders, ->{where attachable_type: 'guarantor_legal'}, class_name: 'Founder', dependent: :destroy
  validates_associated :founders
  has_many :borrower_founders, ->{where attachable_type: 'borrower'}, class_name: 'Founder', dependent: :destroy
  validates_associated :borrower_founders

  has_one :address_legal, ->{where type_a: 'legal'}, class_name:'Address', dependent: :destroy
  has_one :address_actual, ->{where type_a: 'actual'}, class_name:'Address', dependent: :destroy

  accepts_nested_attributes_for :person, allow_destroy: true
  accepts_nested_attributes_for :bank_account, allow_destroy: true
  accepts_nested_attributes_for :founders, allow_destroy: true
  accepts_nested_attributes_for :borrower_founders, allow_destroy: true

  accepts_nested_attributes_for :address_legal, allow_destroy: true
  accepts_nested_attributes_for :address_actual, allow_destroy: true

  validates :type_o, presence: true

  validates :inn, presence: true
  validate :inn_length_validation

  validates :kpp, presence: true, unless: :skip_kpp_validation
  validate :kpp_length_validation, unless: :skip_kpp_validation


  validates :name, presence: true
  validates :fullname, presence: true

  validates :head_position, presence: true

  #validates :reg_date, presence: true
  #validates :ogrn, presence: true


  private

    def inn_length_validation
      if type_o == "ЮЛ"
        errors.add(:inn, I18n.t('activerecord.errors.models.organization.attributes.inn.fail_length', count: 10)) if inn.length != 10
      else
        errors.add(:inn, I18n.t('activerecord.errors.models.organization.attributes.inn.fail_length', count: 12)) if inn.length != 12
      end
    end

    def kpp_length_validation
      if type_o == "ЮЛ"
        errors.add(:kpp, I18n.t('activerecord.errors.models.organization.attributes.inn.fail_length', count: 9)) if kpp.length != 9
      end
    end

end
