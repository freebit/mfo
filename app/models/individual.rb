class Individual < ActiveRecord::Base
  belongs_to :organization
  belongs_to :order

  before_save { self.email = email.downcase }


  validates :fullname, presence: true, length: {maximum: 250}
  validates :birthday, presence: true
  validates :birth_place, presence: true
  validates :citizenship, presence: true
  validates :reg_place, presence: true
  validates :curr_place, presence: true
  validates :pass_serial_number, presence: true, uniqueness: true
  validates :pass_issue_date, presence: true
  validates :pass_issued, presence: true
  validates :pass_issued_code, presence: true

  EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email,  format: {with:EMAIL_REGEX}


end