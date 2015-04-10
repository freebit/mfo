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
    @user = User.new user_params

    if @user.save
        create_user_role
        redirect_to users_path
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

    if params[:user][:password].blank?
      @user.skip_password_validation = true
      cur_params = user_params_without_pass
    else
      cur_params = user_params
    end

    if @user.update_attributes(cur_params)
      update_user_role
      flash[:success] = "Данные пользователя обновлены"
      redirect_to @user
    else
      @title = "Редактирование пользователя"
      render 'edit'
    end

  end

  def ajax_uzel

    client = Savon_client::CLIENT

    response = client.call(:get_client, message: {ИНН:params[:inn], КПП:params[:kpp]})

    #binding.pry

    if response.body[:fault].present?

      @response = {status:"error",message:response.body[:fault][:reason][:text]}

    else

      @response = {status:"ok", message:"", data:response.body[:get_client_response][:return]}

    end

    render json: @response

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

    def update_user_role
      role = Role.find_by_name params[:user][:roles]
      user_role = UsersRole.find_by(user:@user)
      user_role.update_attribute(:role, role)
    end

    def user_params_without_pass
      params.require(:user).permit(:name, :email, :active)
    end

    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation, :active)
    end

end
