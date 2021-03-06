class OrdersController < ApplicationController


  before_action :signed_in_user, only: [:index, :new, :edit]
  #before_action :user_is_admin, only:[:index, :new]

  @EDIT_KEY = "editKey"
  TARIFS = Tarif.select("type_t, platform, rate, dop_rate, client_rate, client_dop_rate, minimum, personal_number_flag").all

  def index
    @title = "История заявок"

    @tarifs = TARIFS

    @orders = Order.where(agent:current_user.email, status: "На заполнении").order(:updated_at).reverse_order

  end

  def new
    @title = "Новая заявка"
    @order = Order.new

    @order.build_borrower

    @order.borrower.build_address_legal
    @order.borrower.build_address_actual

    @order.borrower.borrower_founders.build



    @order.borrower.build_bank_account
    @order.borrower.bank_account.build_bank



    @order.borrower.build_person
    @order.borrower.person.build_reg_place
    @order.borrower.person.build_curr_place

    @order.guarantor_individuals.build
    @order.guarantor_individuals[0].build_reg_place
    @order.guarantor_individuals[0].build_curr_place


    @order.guarantor_legals.build
    @order.guarantor_legals[0].build_address_legal
    @order.guarantor_legals[0].build_address_actual
    @order.guarantor_legals[0].founders.build
    @order.guarantor_legals[0].build_bank_account

    @order.guarantor_legals[0].bank_account.build_bank

    @order.guarantor_legals[0].build_person
    @order.guarantor_legals[0].person.build_reg_place
    @order.guarantor_legals[0].person.build_curr_place

    @order.documents.build


    @tarifs = TARIFS

  end

  def create

    @order = Order.new order_params

    #если не отправляет в МФО
    if !service_params[:send_mfo].to_b
      # и сохраняет не конечник или гость, то снимаем валидации
      if current_user.present? && !current_user.is_client?
        @order.skip_validation = true
        @order.borrower.skip_validation = true
        @order.borrower.borrower_founders[0].skip_validation = true
        @order.borrower.person.skip_validation = true
      end
    end

    if order_params[:borrower_attributes][:type_o] == "ФЛ"
      @order.borrower.skip_kpp_validation = true
    end


    if @order.save

      @order.update_attribute :editkey , SecureRandom.urlsafe_base64

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
          @order.update_attribute :status, "заявка в МФО"
          @order.destroy
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

      if @order.borrower.borrower_founders.blank?
        @order.borrower.borrower_founders.build
      end

      if @order.guarantor_individuals.blank?
        @order.guarantor_individuals.build
        @order.guarantor_individuals[0].build_reg_place
        @order.guarantor_individuals[0].build_curr_place
      end

      if @order.guarantor_legals.blank?
        @order.guarantor_legals.build
        @order.guarantor_legals[0].founders.build
        @order.guarantor_legals[0].build_address_legal
        @order.guarantor_legals[0].build_address_actual

        @order.guarantor_legals[0].build_bank_account
        @order.guarantor_legals[0].bank_account.build_bank
        @order.guarantor_legals[0].build_person
        @order.guarantor_legals[0].person.build_reg_place
        @order.guarantor_legals[0].person.build_curr_place
      end


      if @order.documents.blank?
        @order.documents.build
      end

      @tarifs = TARIFS

      render action: "new"
    end

  end

  def edit
    @title = "Редактирование заявки"

    #binding.pry

    @order = Order.find params[:id]

    if @order.borrower.borrower_founders.blank?
      @order.borrower.borrower_founders.build
    end


    if @order.guarantor_individuals.blank?
      @order.guarantor_individuals.build
      @order.guarantor_individuals[0].build_reg_place
      @order.guarantor_individuals[0].build_curr_place
    end

    if @order.guarantor_legals.blank?
      @order.guarantor_legals.build
      @order.guarantor_legals[0].founders.build
      @order.guarantor_legals[0].build_address_legal
      @order.guarantor_legals[0].build_address_actual

      @order.guarantor_legals[0].build_bank_account
      @order.guarantor_legals[0].bank_account.build_bank
      @order.guarantor_legals[0].build_person
      @order.guarantor_legals[0].person.build_reg_place
      @order.guarantor_legals[0].person.build_curr_place
    end

    if @order.documents.blank?
      @order.documents.build
    end

    @tarifs = TARIFS


  end

  def update
    @order = Order.find params[:id]

    #если не отправляет в МФО
    if !service_params[:send_mfo].to_b
        # и сохраняет не конечник или гость, то снимаем валидации
      if current_user.present? && !current_user.is_client?
        @order.skip_validation = true
        @order.borrower.skip_validation = true
        @order.borrower.borrower_founders[0].skip_validation = true
        @order.borrower.person.skip_validation = true
      end
    end

    if order_params[:borrower_attributes][:type_o] == "ФЛ"
      @order.borrower.skip_kpp_validation = true
    end

    @message = ""

    if @order.update_attributes order_params

        @order.update_attribute :updated_at, DateTime.now

      if service_params[:send_mfo].to_b

        if send_mfo @order
          @order.update_attribute :status, "Отправлена в МФО"
          @order.destroy
          flash[:success] = "Заявка отправлена в МФО"
        else
          flash[:warning] = "Не удалось отправить заявку в МФО"
        end

      else
        flash[:success] = "Заявка обновлена"
      end



      unless session[:editkey].present?
         redirect_to orders_path
      else
        render action: 'guest_index'
      end

    else

      @title = "Редактирование заявки"

      if @order.borrower.borrower_founders.blank?
        @order.borrower.borrower_founders.build
      end

      if @order.guarantor_individuals.blank?
        @order.guarantor_individuals.build
        @order.guarantor_individuals[0].build_reg_place
        @order.guarantor_individuals[0].build_curr_place
      end



      if @order.guarantor_legals.blank?
          @order.guarantor_legals.build
          @order.guarantor_legals[0].founders.build
          @order.guarantor_legals[0].build_address_legal
          @order.guarantor_legals[0].build_address_actual

          @order.guarantor_legals[0].build_bank_account
          @order.guarantor_legals[0].bank_account.build_bank
          @order.guarantor_legals[0].build_person
          @order.guarantor_legals[0].person.build_reg_place
          @order.guarantor_legals[0].person.build_curr_place
      end



      if @order.documents.blank?
        @order.documents.build
      end

      @tarifs = TARIFS

      render 'edit'
    end

  end


  def destroy
    Order.find(params[:id]).destroy
    flash[:success] = "Заявка удалена"
    redirect_to orders_path
  end


  def guest_index

  end

  private

    def order_params

      address_attributes = [:id, :indx, :region, :raion, :punkt, :street_code, :street_name, :house, :corps, :building, :apart_number, :_destroy]
      organization_attributes = [:id, :type_o, :inn, :kpp, :name, :fullname, :ogrn, :head_position, :phone, :email, :reg_date, :_destroy, address_legal_attributes: address_attributes, address_actual_attributes: address_attributes]
      person_attributes = [:id, :fullname, :birthday, :citizenship, :phone, :email, :pass_serial_number, :pass_issued, :pass_issued_code, :pass_issue_date, :old_pass_serial_number, :old_pass_issued, :old_pass_issued_code, :old_pass_issue_date, :_destroy, :birth_place, reg_place_attributes: address_attributes, curr_place_attributes: address_attributes]
      bank_attributes = [:id, :bik, :korr_number, :inn, :name, :city, :address, :_destroy]

      params.require(:order).permit(:summa, :platform, :tarif, :base_rate, :submission_deadline, :agent, :agent_name,
                                    :agent_summa, :mfo_summa, :dogovor_summa, :number, :number_mfo,
                                    :number_data_protocol, :contract_subject, :lot_number, :personal_number, :number_mmvb, :create_date, :updated_at, :status,

                                    borrower_attributes:[
                                        organization_attributes,
                                        borrower_founders_attributes:[:id, :_destroy, :name, :pass_data_ogrn, :share],
                                        bank_account_attributes:[
                                            :id,:_destroy,
                                            :account_number,
                                            bank_attributes: bank_attributes
                                        ],
                                        person_attributes: person_attributes
                                    ],

                                    guarantor_legals_attributes:[
                                        organization_attributes,
                                        founders_attributes:[:id, :_destroy, :name, :pass_data_ogrn, :share],
                                        bank_account_attributes:[
                                            :id,:_destroy,
                                            :account_number,
                                            bank_attributes: bank_attributes
                                        ],
                                        person_attributes: person_attributes
                                    ],

                                    guarantor_individuals_attributes: person_attributes,

                                    documents_attributes:[:id, :order_id, :type_d, :file, :file_cache, :remove_file, :_destroy]
      )
    end

    def service_params
      params.require(:service).permit(:guarantor_type,
                                      :active_guarantor_individual,
                                      :active_guarantor_legal,
                                      :send_mfo,
                                      :new_order_active_tab,
                                      :edit_order_active_tab,
                                      :order_rate
      )
    end

  def is_order_by_key?
    Order.where(editkey:@editkey).present?
  end

  def user_is_admin
    unless current_user.is_admin? || is_order_by_key?
      redirect_to signin_url, notice: "Войдите как администратор"
    end
  end

  def signed_in_user
    unless signed_in? || is_order_by_key?
      store_location
      redirect_to signin_url, notice: "Для выполнения этого действия нужна авторизация"
    end
  end

end
