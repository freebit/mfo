module SessionsHelper

  def sign_in(user)
    remember_token = User.new_remember_token
    cookies.permanent[:remember_token] = remember_token
    user.update_attribute(:remember_token, User.encrypt(remember_token))
    user.update_attribute(:last_visit, Time.now)
    self.current_user = user

    #почистим признак клиента-редактора, если вдруг до этого заходили по ним
    session.delete(:editkey)

    unless fetch_agent_data(user)
      flash[:warning] = "Извините за задержку. Сервер не отвечает. Не удалось обновить данные."
    end

  end

  def sign_out
    current_user.update_attribute(:remember_token, User.encrypt(User.new_remember_token)) if current_user.present?
    cookies.delete(:remember_token)
    self.current_user = nil
  end

  def current_user=(user)
    @current_user = user
  end

  def current_user
    remember_token = User.encrypt(cookies[:remember_token])
    @current_user ||= User.find_by(remember_token: remember_token)
  end

  def signed_in?
    !current_user.nil?
  end

  def redirect_back_or(default)
    redirect_to(session[:return_to] || default)
    session.delete(:return_to)
  end

  def store_location
    session[:return_to] = request.url if request.get?
  end

end
