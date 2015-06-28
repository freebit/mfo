class Tarif < ActiveRecord::Base

  #attr_accessible :client_dop_rate

  validates :client_dop_rate, presence: true

end
