class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_filter :set_share_variable

  include ApplicationHelper
  include UsersHelper
  include SessionsHelper
  include OrderHelper



  protected

    def set_share_variable
      @requested_action = params[:action]
      @editkey = params.keys.first if (params.keys.first.size == 22 && params.keys.first.size != "controller")
      session[:editkey] ||= @editkey


    end

end
