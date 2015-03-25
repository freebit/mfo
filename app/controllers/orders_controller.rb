class OrdersController < ApplicationController

  def index
    @title = "История заявок"
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

    @order = Order.new order_params

    if order_params[:borrower_attributes][:type_o] == "ФЛ"
      @order.borrower.skip_kpp_validation = true
    end


    if @order.save

    else
      @title = "Новая заявка"
      render action: "new"
    end

  end

  def edit

  end

  private

    def order_params
      params.require(:order).permit(:summa,

                                    borrower_attributes:[ :type_o, :name, founder_attributes:[:name], bank_account_attributes:[ bank_attributes:[:bik]], person_attributes:[:fullname] ],

                                    guarantor_legal_attributes:[:inn, bank_account_attributes:[ bank_attributes:[:bik]], person_attributes:[:fullname] ],

                                    guarantor_individual_attributes:[:fullname]
      )
    end

    def borrower_params
      params.require(:borrower).permit(:type_o, :name)
    end

end
