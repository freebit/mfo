class OrdersController < ApplicationController


  before_action :signed_in_user, only: [:index, :edit, :new, :update]
  before_action :user_is_admin, only:[:index, :new, :edit, :update]

  def index
    @title = "История заявок"
    #fetch_orders_with_soap
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


    @order.guarantor_individuals.build


    @order.guarantor_legals.build
    @order.guarantor_legals[0].build_bank_account
    @order.guarantor_legals[0].bank_account.build_bank
    @order.guarantor_legals[0].build_person

    @order.documents.build


    @tarifs = Tarif.select("type_t, platform, rate, dop_rate, minimum").all

  end

  def create

    @order = Order.new order_params

    if order_params[:borrower_attributes][:type_o] == "ФЛ"
      @order.borrower.skip_kpp_validation = true
    end

    if @order.save

      if order_params[:documents_attributes].present?
        order_params[:documents_attributes].each do |d|
          if d.last[:_destroy] == 'true'
            if @order.documents[d.first.to_i].present?
              @order.documents[d.first.to_i].remove_file!
              @order.documents[d.first.to_i].destroy
            end
          end
        end
      end

      if service_params[:send_mfo].to_b
        if send_mfo @order
          flash[:success] = "Заявка создана <br/> Заявка отправлена в МФО"
        else
          flash[:warning] = "Заявка создана <br/> Не удалось отправить заявку в МФО"
        end
      else
        flash[:success] = "Заявка создана"
      end


      redirect_to orders_path

    else

      @title = "Новая заявка"

      if @order.documents.blank?
        @order.documents.build
      end

      if @order.guarantor_individuals.blank?
        @order.guarantor_individuals.build
      end

      if @order.guarantor_legals.blank?
        @order.guarantor_legals << Organization.new( bank_account:BankAccount.new(bank:Bank.new), person:Individual.new )
      end

      @tarifs = Tarif.select("type_t, platform, rate, dop_rate, minimum").all

      render action: "new"
    end

  end

  def edit
    @title = "Редактирование заявки"
    @order = Order.find params[:id]

    if @order.guarantor_individuals.blank?
      @order.guarantor_individuals.build
    end

    if @order.guarantor_legals.blank?
      @order.guarantor_legals.build
      @order.guarantor_legals[0].build_bank_account
      @order.guarantor_legals[0].bank_account.build_bank
      @order.guarantor_legals[0].build_person
    end

    if @order.documents.blank?
      @order.documents.build
    end

    @tarifs = Tarif.select("type_t, platform, rate, dop_rate, minimum").all

  end

  def update
    @order = Order.find params[:id]

    @message = ""

    if @order.update_attributes order_params

        @order.update_attribute :updated_at, DateTime.now

      if service_params[:send_mfo].to_b
        if send_mfo @order

          @order.update_attribute :status, "Отправлена в МФО"

          flash[:success] = "Заявка обновлена <br/> Заявка отправлена в МФО"

        else

          flash[:warning] = "Заявка обновлена <br/> Не удалось отправить заявку в МФО"

        end

      else
        flash[:success] = "Заявка обновлена"
      end


      redirect_to orders_path

    else
      @title = "Редактирование заявки"

      if @order.guarantor_individuals.blank?
        @order.guarantor_individuals.build
      end

      if @order.guarantor_legals.blank?
        @order.guarantor_legals.build
        @order.guarantor_legals[0].build_bank_account
        @order.guarantor_legals[0].bank_account.build_bank
        @order.guarantor_legals[0].build_person
      end

      if @order.documents.blank?
        @order.documents.build
      end

      render 'edit'
    end

  end

  private

    def order_params

      organization_attributes = [:id, :type_o, :inn, :kpp, :name, :fullname, :ogrn, :address_legal, :address_actual, :head_position, :reg_date, :_destroy]
      person_attributes = [:id, :fullname, :birthday, :birth_place, :citizenship, :phone, :email, :reg_place, :curr_place, :curr_place, :pass_serial_number, :pass_issued, :pass_issued_code, :pass_issue_date, :old_pass_serial_number, :old_pass_issued, :old_pass_issued_code, :old_pass_issue_date, :_destroy]
      bank_attributes = [:id, :bik, :korr_number, :inn, :name, :city, :address]

      params.require(:order).permit(:summa, :platform, :submission_deadline, :agent, :agent_name, :agent_summa, :mfo_summa, :order_summa, :number, :number_mfo, :number_data_protocol,:personal_number, :create_date, :updated_at, :status,

                                    borrower_attributes:[
                                        organization_attributes,
                                        founder_attributes:[:name, :pass_data_ogrn, :share],
                                        bank_account_attributes:[
                                            :id,:_destroy,
                                            :account_number,
                                            bank_attributes:bank_attributes
                                        ],
                                        person_attributes:person_attributes
                                    ],

                                    guarantor_legals_attributes:[
                                        organization_attributes,
                                        bank_account_attributes:[
                                            :id,:_destroy,
                                            :account_number,
                                            bank_attributes:bank_attributes
                                        ],
                                        person_attributes: person_attributes
                                    ],

                                    guarantor_individuals_attributes: person_attributes,

                                    documents_attributes:[:id, :order_id, :type_d, :file, :file_cache, :remove_file, :_destroy]
      )
    end

    def service_params
      params.require(:service).permit(:guarantor_type, :active_guarantor_individual, :active_guarantor_legal, :send_mfo, :order_rate)
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
