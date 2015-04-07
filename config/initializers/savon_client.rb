class Savon_client

  CLIENT = Savon.client do
    soap_version 2
    wsdl "http://217.29.50.201:8090/mfobg/ws/WebExchange.1cws?wsdl"
    env_namespace :soap
    headers({})
    namespaces(
        "xmlns:soap" => "http://www.w3.org/2003/05/soap-envelope",
        "xmlns:mfo" => 'Mfoalliance',
        "xmlns:mfo1"=>"http://mfoalliance.ru"
    )
    #raise_errors false
    pretty_print_xml true
    log true
  end

end