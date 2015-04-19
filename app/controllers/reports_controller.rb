class ReportsController < ApplicationController

  before_action :user_is_admin_or_is_agent, only:[:index]

  def index
    @title = "Отчет по договорам"

    @tarifs = Tarif.select("type_t, platform, rate, dop_rate, minimum").all
  end

  def fetch_report



    @response = {}
    @error = {}

   if filter_params[:date_from].blank? || filter_params[:date_to].blank?

     @response = {status:"error",message:"Укажите начальную и конечную дату"}

   else

     @data_from = DateTime.parse filter_params[:date_from]
     @data_to = DateTime.parse filter_params[:date_to]

     client = Savon_client::CLIENT
     response = client.call(:get_data, message:{ КодАгента:current_user.email, ДатаНачала:@data_from, ДатаКонца:@data_to })

     #binding.pry

     if response.body[:fault].present?

       @response = {status:"error",message:response.body[:fault][:reason][:text]}

     else
       @response = {status:"ok", message:"", data:response.body[:get_data_response][:return][:Заявка]}
     end

   end



    #binding.pry



    render json: @response

  end


  private

    def user_is_admin_or_is_agent

      unless current_user.is_admin? || current_user.is_agent?
        redirect_to signin_url, notice: "Войдите как администратор"
      end

    end

    def filter_params
      params.require(:shift).permit(:date_from, :date_to)
    end
end
