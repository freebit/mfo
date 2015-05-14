class Founder < ActiveRecord::Base

  belongs_to :organization

  attr_accessor :_destroy
  attr_accessor :skip_validation

  validates :attachable_type, presence: true
  validates :name, presence: true, unless: :skip_validation
  validates :share, presence: true, unless: :skip_validation



  #validates :pass_data_ogrn, presence: true

end
