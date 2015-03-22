class WelcomeController < ApplicationController
  def index
    @title = "Начинаем юзать soap"


    client = Savon.client(soap_version:2, namespace:"http://mfoalliance.ru", wsdl:"http://217.29.50.201:8090/mfobg/ws/WebExchange.1cws?wsdl")

    @operations = client.operations

    response = client.call(:get_data)
    @order_data = response.body[:get_data_response][:return]

    response = client.call(:get_client, message: {ИНН:"7710948466", КПП:"771001001"})
    @client_data = response.body[:get_client_response][:return]






    #binding.pry

  end
end
