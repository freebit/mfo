class Founder < ActiveRecord::Base

  belongs_to :organization

  attr_accessor :_destroy

  validates :attachable_type, presence: true
  validates :name, presence: true
  #validates :pass_data_ogrn, presence: true
  validates :share, presence: true

end
