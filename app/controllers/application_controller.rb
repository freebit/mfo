class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  @tarifs = Tarif.select("type_t, platform, rate, dop_rate, minimum").all

  include ApplicationHelper
  include UsersHelper
  include SessionsHelper
  include OrderHelper



end
