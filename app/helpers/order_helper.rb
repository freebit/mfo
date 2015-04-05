module OrderHelper

  def send_mfo(order)

    require 'base64'

    savon_client = Savon.client do
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

    @operations = savon_client.operations

    if @operations.include? :send_data

      @order = { МассивАнкет: [ АнкетаЗаявка: {
                  Дата: order.create_date,
                  Номер: "ДМЗ0320-002",
                  Агент: order.agent,
                  АгентНаименование: order.agent_name,
                  СуммаВознагражденияАгента: order.agent_summa,
                  СтатусСделки: "test",
                  КрайнийСрокПредоставления: order.submission_deadline,
                  НомерМФО: order.number_mfo,
                  НомерДатаПротокола: order.number_data_protocol,
                  СуммаГарантийногоВзноса: order.summa,
                  СуммаЗайма: order.summa,
                  ЭлектроннаяПлощадка: order.platform,
                  ЛицевойСчет: order.personal_number,
                  Заемщик:{
                            Тип: order.borrower.type_o,
                            Наименование: order.borrower.name,
                            ПолноеНаименование: order.borrower.fullname,
                            ИНН:order.borrower.inn,
                            КПП: order.borrower.kpp,
                            ОГРН: order.borrower.ogrn,
                            ОсновнойБанковскийСчет:{
                                БИК:order.borrower.bank_account.bank.bik,
                                НомерСчета: order.borrower.bank_account.account_number,
                                БанкНаименование: order.borrower.bank_account.bank.name,
                                КоррСчет:order.borrower.bank_account.bank.korr_number,
                                ИНН:order.borrower.bank_account.bank.inn,
                            },
                            ЮридическийАдрес:order.borrower.address_legal,
                            ФактическийАдрес:order.borrower.address_actual,
                            ДолжностьРуководителя:order.borrower.head_position,
                            ДатаГосРегистрации:order.borrower.reg_date,
                            ПерсональныеДанныеЗаявителя:{
                                ФИО: order.borrower.person.fullname,
                                ДатаРождения: order.borrower.person.birthday,
                                СерияНомерПаспорта: order.borrower.person.pass_serial_number,
                                ДатаВыдачи: order.borrower.person.pass_issue_date,
                                КемВыдан: order.borrower.person.pass_issued,
                                КодПодразделения: order.borrower.person.pass_issued_code,
                                МестоРождения: order.borrower.person.birth_place,
                                Гражданство:order.borrower.person.citizenship,
                                АдресРегистрации:order.borrower.person.reg_place,
                                АдресМестаПребывания:order.borrower.person.curr_place,
                                Телефон:order.borrower.person.phone,
                                ЭлектроннаяПочта:order.borrower.person.email,
                                СерияНомерСП:order.borrower.person.old_pass_serial_number,
                                ДатаВыдачиСП:order.borrower.person.old_pass_issue_date,
                                КемВыданСП:order.borrower.person.old_pass_issued,
                                КодПодразделенияСП:order.borrower.person.old_pass_issued_code,
                            },
                            Учередители:[{
                                             УчередительНаименование: order.borrower.founder.name,
                                             Доля: order.borrower.founder.share,
                                             ПаспортныеДанныеОГРН: order.borrower.founder.pass_data_ogrn
                                         }]

                          },
                  ПоручительЮЛ:{},
                  ПоручительФЛ:{
                      ФИО: order.borrower.person.fullname,
                      ДатаРождения: order.borrower.person.birthday,
                      СерияНомерПаспорта: order.borrower.person.pass_serial_number,
                      ДатаВыдачи: order.borrower.person.pass_issue_date,
                      КемВыдан: order.borrower.person.pass_issued,
                      КодПодразделения: order.borrower.person.pass_issued_code,
                      МестоРождения: order.borrower.person.birth_place,
                      Гражданство:order.borrower.person.citizenship,
                      АдресРегистрации:order.borrower.person.reg_place,
                      АдресМестаПребывания:order.borrower.person.curr_place,
                      Телефон:order.borrower.person.phone,
                      ЭлектроннаяПочта:order.borrower.person.email,
                      СерияНомерСП:order.borrower.person.old_pass_serial_number,
                      ДатаВыдачиСП:order.borrower.person.old_pass_issue_date,
                      КемВыданСП:order.borrower.person.old_pass_issued,
                      КодПодразделенияСП:order.borrower.person.old_pass_issued_code,
                  },
                  ДокументыИсполнителя:{
                      ТипДокументаИсполнителя: order.documents.first.type_d,
                      Файл: Base64.encode64(order.documents.first.file.path),
                      Расширение: order.documents.first.file.path.split(".").last
                  }

                }]
      }

      response = savon_client.call(:send_data, message: @order)

      binding.pry

    end

  # rescue Savon::SOAPFault => error
  #
  #   logger.log error.http.code
  #
  # raise

  end

  def logger
    logger = Logger.new(STDOUT)
    logger.level = Logger::WARN
    logger
  end

end
