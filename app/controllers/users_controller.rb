class UsersController < ApplicationController
  helper_method :users

  before_action :signed_in_user, only: [:index, :edit, :update]
  before_action :user_is_admin, only:[:index, :edit, :update]

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
    @title = "Редактирование пользователя"
    @user = User.find(params[:id])
  end

  def update

    @user = User.find(params[:id])

    if @user.update_attributes(user_params)
      flash[:success] = "Данные пользователя обновлены"
      redirect_to @user
    else
      @title = "Редактирование пользователя"
      render 'edit'
    end

  end

  private

    def signed_in_user
      unless signed_in?
        store_location
        redirect_to signin_url, notice: "Для выполнения этого действия нужна авторизация"
      end
    end

    def user_is_admin
      unless current_user.is_admin?
        redirect_to signin_url, notice: "Войдите как администратор"
      end
    end

    def users
      @users ||= User.all
    end

    def create_user_role
      @role = Role.find_by_name params[:user][:roles]
      UsersRole.create user:@user, role:@role
    end

    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation, :active)
    end

end
