class Founder < ActiveRecord::Base

  belongs_to :organization

  validates :name, presence: true
  validates :pass_data_ogrn, presence: true
  validates :share, presence: true

end
