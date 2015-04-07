class WelcomeController < ApplicationController
  def index
    @title = "Начинаем юзать soap"


    savon_client = Savon.client(soap_version:2, namespace:"http://mfoalliance.ru", wsdl:"http://217.29.50.201:8090/mfobg/ws/WebExchange.1cws?wsdl")

    @operations = savon_client.operations

    response = savon_client.call(:get_data, message:{КодАгента:current_user.email})
    @order_data = response.body[:get_data_response][:return][:АнкетаЗаявка][0..3]
    #

    response = savon_client.call(:get_client, message: {ИНН:"5609076848", КПП:"560901001"})
    @client_data = response.body[:get_client_response][:return]






    #binding.pry

  end
end
