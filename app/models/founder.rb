class Founder < ActiveRecord::Base

  belongs_to :organization

  validates :name, presence: true
end
