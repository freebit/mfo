class SessionsController < ApplicationController

  def new
    @title = "Вход в личный кабинет"
  end

  def create
    user = User.find_by email: params[:session][:email].downcase
    if user && user.authenticate(params[:session][:password])
      sign_in user
      redirect_back_or orders_path
    else
      @title = "Вход в личный кабинет"
      flash[:danger] = "Не верный логин или пароль"
      render 'new'
    end
  end

  def destroy
    sign_out
    redirect_to signin_url
  end

end
