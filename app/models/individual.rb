class Individual < ActiveRecord::Base
  belongs_to :organization
  belongs_to :order

  #before_save { self.email = email.downcase }

  attr_accessor :_destroy
  attr_accessor :skip_validation

  has_one :reg_place, ->{where type_a: 'reg_place'}, class_name:'Address', dependent: :destroy
  has_one :curr_place, ->{where type_a: 'curr_place'}, class_name:'Address', dependent: :destroy

  accepts_nested_attributes_for :reg_place, allow_destroy: true
  accepts_nested_attributes_for :curr_place, allow_destroy: true


  validates :fullname, presence: true, length: {maximum: 250}, unless: :skip_validation
  #validates :birthday, presence: true
  # validates :birth_place, presence: true
  # validates :citizenship, presence: true
  # validates :reg_place, presence: true
  # validates :curr_place, presence: true
  # validates :pass_serial_number, presence: true
  # validates :pass_issue_date, presence: true
  # validates :pass_issued, presence: true
  # validates :pass_issued_code, presence: true

  #validates :old_pass_serial_number, presence: true
  #validates :old_pass_issue_date, presence: true
  #validates :old_pass_issued, presence: true
  #validates :old_pass_issued_code, presence: true

  #validates :email,  format: { with: /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i }
  #validates :phone, presence: true

end
