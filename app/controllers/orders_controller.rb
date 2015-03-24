class OrdersController < ApplicationController

  def index
    @title = "История заявок"
  end

  def new
    @title = "Новая заявка"
    @order = Order.new
    @borrower = Organization.new

    # @borrower_founder = Founder.new
    #
    # @borrower_bank_account = BankAccount.new
    # @borrower_bank_account_bank = Bank.new


  end

  def create

    @order = Order.new order_params
    @borrower = Organization.new borrower_params

    @order_save =  @order.save
    @borrower_save = @borrower.save

    if @borrower_save && @order_save

    else
      @title = "Новая заявка"
      #@errors =  @borrower.errors
      render 'new'
    end

  end

  def edit

  end

  private

    def order_params
      params.require(:order).permit()
    end

    def borrower_params
      params.require(:borrower).permit(:type_o, :name)
    end

end
