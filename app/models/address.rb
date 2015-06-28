class Address < ActiveRecord::Base

  belongs_to :organization
  belongs_to :individual

  attr_accessor :_destroy

  #validates :region, presence: true

end
