class OrdersController < ApplicationController

  before_action :signed_in_user, only: [:index, :edit, :new, :update]
  before_action :user_is_admin, only:[:index, :new, :edit, :update]

  def index
    @title = "История заявок"
    @orders = Order.all
  end

  def new
    @title = "Новая заявка"
    @order = Order.new

    @order.build_borrower

    @order.borrower.build_founder

    @order.borrower.build_bank_account
    @order.borrower.bank_account.build_bank
    @order.borrower.build_person

    @order.build_guarantor_legal
    @order.guarantor_legal.build_bank_account
    @order.guarantor_legal.bank_account.build_bank

    @order.guarantor_legal.build_person

    @order.build_guarantor_individual

  end

  def create

    curr_params = order_params

    if service_params[:guarantor_type] == "guarantor_individual"
      curr_params.delete(:guarantor_legal_attributes)
    elsif service_params[:guarantor_type] == "guarantor_legal"
      curr_params.delete(:guarantor_individual_attributes)
    end

    @order = Order.new curr_params

    if order_params[:borrower_attributes][:type_o] == "ФЛ"
      @order.borrower.skip_kpp_validation = true
    end

    if @order.save

    else
      @title = "Новая заявка"

      # @order = Order.new
      #
      # @order.build_borrower
      # @order.borrower.build_founder
      # @order.borrower.build_bank_account
      # @order.borrower.bank_account.build_bank
      # @order.borrower.build_person
      # @order.build_guarantor_legal
      # @order.guarantor_legal.build_bank_account
      # @order.guarantor_legal.bank_account.build_bank
      # @order.guarantor_legal.build_person
      # @order.build_guarantor_individual

      render action: "new"
    end

  end

  def edit

  end

  def update

  end

  private

    def order_params

      organization_attributes = [:type_o, :inn, :kpp, :name, :fullname, :ogrn, :address_legal, :address_actual, :head_position, :reg_date]
      person_attributes = [:fullname, :birthday, :birth_place, :citizenship, :phone, :email, :reg_place, :curr_place, :curr_place, :pass_serial_number, :pass_issued, :pass_issued_code, :pass_issue_date, :old_pass_serial_number, :old_pass_issued, :old_pass_issued_code, :old_pass_issue_date]
      bank_attributes = [:bik, :korr_number, :inn, :name, :city, :address]

      params.require(:order).permit(:summa, :platform, :submission_deadline, :agent, :agent_name, :agent_summa, :number, :number_mfo, :number_data_protocol,:personal_number, :status,

                                    borrower_attributes:[
                                        organization_attributes,
                                        founder_attributes:[:name, :pass_data_ogrn, :share],
                                        bank_account_attributes:[
                                            :account_number,
                                            bank_attributes:bank_attributes
                                        ],
                                        person_attributes:person_attributes
                                    ],

                                    guarantor_legal_attributes:[
                                        organization_attributes,
                                        bank_account_attributes:[
                                            :account_number,
                                            bank_attributes:bank_attributes
                                        ],
                                        person_attributes:person_attributes
                                    ],

                                    guarantor_individual_attributes:person_attributes
      )
    end

    def service_params
      params.require(:service).permit(:guarantor_type)
    end

  def user_is_admin
    unless current_user.is_admin?
      redirect_to signin_url, notice: "Войдите как администратор"
    end
  end

  def signed_in_user
    unless signed_in?
      store_location
      redirect_to signin_url, notice: "Для выполнения этого действия нужна авторизация"
    end
  end

end
