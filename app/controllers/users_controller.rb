class UsersController < ApplicationController
  helper_method :users

  def index
    @title = "Список пользователей"
    @users = User.all
  end

  def show
    @title = "Профиль пользователя"
    @user = User.find(params[:id])
  end

  def new
    @title = "Создать пользователя"
    @user = User.new
  end

  def create

    #binding.pry

    @user = User.new user_params

    if @user.save
        create_user_role
        redirect_to @user
    else

      @title = "Создать пользователя"
      render 'new'

    end



  end

  def edit

  end

  private

    def users
      @users ||= User.all
    end

    def create_user_role
      @role = Role.find_by_name params[:user][:role]
      UsersRole.create user:@user, role:@role
    end

    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation, :active)
    end

end
