module OrderHelper

  def send_mfo(order)

    require 'base64'

    savon_client = Savon_client::CLIENT

    @operations = savon_client.operations

    if @operations.include? :send_data

    # @order.МассивАнкет

      order_raw = { МассивАнкет: [ АнкетаЗаявка: {
                  Дата:  format_date_for_datetime( DateTime.now ),
                  Номер: "",
                  Агент: order.agent,
                  АгентНаименование: order.agent_name,
                  СуммаВознагражденияАгента: order.agent_summa,
                  СтатусСделки: "На заполнении",
                  КрайнийСрокПредоставления: format_date_for_datetime(order.submission_deadline),
                  НомерМФО: nil,
                  НомерДатаПротокола: order.number_data_protocol,
                  СуммаГарантийногоВзноса: order.dogovor_summa,
                  СуммаЗайма: order.summa,
                  ЭлектроннаяПлощадка: order.platform,
                  Тариф: order.tarif,
                  ПредметКонтракта: order.contract_subject,
                  НомерЛота: order.lot_number,
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
                            ЮридическийАдрес:{
                                ПочтовыйИндекс:order.borrower.address_legal.indx,
                                Регион:order.borrower.address_legal.region,
                                Район:order.borrower.address_legal.raion,
                                НаселенныйПункт:order.borrower.address_legal.punkt,
                                Улица:order.borrower.address_legal.street_name,
                                КодУлицы:order.borrower.address_legal.street_code,
                                НомерДома:order.borrower.address_legal.house,
                                Корпус:order.borrower.address_legal.corps,
                                Строение:order.borrower.address_legal.building,
                                НомерКвартиры:order.borrower.address_legal.apart_number
                            },
                            ФактическийАдрес:{
                                ПочтовыйИндекс:order.borrower.address_actual.indx,
                                Регион:order.borrower.address_actual.region,
                                Район:order.borrower.address_actual.raion,
                                НаселенныйПункт:order.borrower.address_actual.punkt,
                                Улица:order.borrower.address_actual.street_name,
                                КодУлицы:order.borrower.address_actual.street_code,
                                НомерДома:order.borrower.address_actual.house,
                                Корпус:order.borrower.address_actual.corps,
                                Строение:order.borrower.address_actual.building,
                                НомерКвартиры:order.borrower.address_actual.apart_number
                            },
                            ДолжностьРуководителя:order.borrower.head_position,
                            ДатаГосРегистрации:format_date_for_datetime(order.borrower.reg_date),
                            ПерсональныеДанныеЗаявителя:{
                                ФИО: order.borrower.person.fullname,
                                ДатаРождения: format_date_for_datetime(order.borrower.person.birthday),
                                СерияНомерПаспорта: order.borrower.person.pass_serial_number,
                                ДатаВыдачи: format_date_for_datetime(order.borrower.person.pass_issue_date),
                                КемВыдан: order.borrower.person.pass_issued,
                                КодПодразделения: order.borrower.person.pass_issued_code,
                                МестоРождения: order.borrower.person.birth_place,
                                Гражданство:order.borrower.person.citizenship,
                                АдресРегистрации:{
                                    ПочтовыйИндекс:order.borrower.person.reg_place.indx,
                                    Регион:order.borrower.person.reg_place.region,
                                    Район:order.borrower.person.reg_place.raion,
                                    НаселенныйПункт:order.borrower.person.reg_place.punkt,
                                    Улица:order.borrower.person.reg_place.street_name,
                                    КодУлицы:order.borrower.person.reg_place.street_code,
                                    НомерДома:order.borrower.person.reg_place.house,
                                    Корпус:order.borrower.person.reg_place.corps,
                                    Строение:order.borrower.person.reg_place.building,
                                    НомерКвартиры:order.borrower.person.reg_place.apart_number
                                },
                                АдресМестаПребывания:{
                                    ПочтовыйИндекс:order.borrower.person.curr_place.indx,
                                    Регион:order.borrower.person.curr_place.region,
                                    Район:order.borrower.person.curr_place.raion,
                                    НаселенныйПункт:order.borrower.person.curr_place.punkt,
                                    Улица:order.borrower.person.curr_place.street_name,
                                    КодУлицы:order.borrower.person.curr_place.street_code,
                                    НомерДома:order.borrower.person.curr_place.house,
                                    Корпус:order.borrower.person.curr_place.corps,
                                    Строение:order.borrower.person.curr_place.building,
                                    НомерКвартиры:order.borrower.person.curr_place.apart_number
                                },
                                Телефон:order.borrower.person.phone,
                                ЭлектроннаяПочта:order.borrower.person.email,
                                СерияНомерСП:order.borrower.person.old_pass_serial_number,
                                ДатаВыдачиСП: format_date_for_datetime(order.borrower.person.old_pass_issue_date) ,
                                КемВыданСП: order.borrower.person.old_pass_issued,
                                КодПодразделенияСП: order.borrower.person.old_pass_issued_code,
                            },
                            Учередители:[]

                          },
                  ПоручительЮЛ:nil,
                  ПоручительФЛ:nil,
                  ДокументыИсполнителя:[]

                }]
      }

      if order.borrower.borrower_founders.any?
        order.borrower.borrower_founders.each_with_index do |bf, index|
          order_raw[:МассивАнкет][0][:АнкетаЗаявка][:Заемщик][:Учередители] << {
              УчередительНаименование: bf.name,
              Доля: bf.share,
              ПаспортныеДанныеОГРН: bf.pass_data_ogrn
          }
        end
      end

      if order.guarantor_individuals[0].present?
        order_raw[:МассивАнкет][0][:АнкетаЗаявка][:ПоручительФЛ] = {
            ФИО: order.guarantor_individuals[0].fullname,
            ДатаРождения: format_date_for_datetime(order.guarantor_individuals[0].birthday),
            СерияНомерПаспорта: order.guarantor_individuals[0].pass_serial_number,
            ДатаВыдачи: format_date_for_datetime(order.guarantor_individuals[0].pass_issue_date),
            КемВыдан: order.guarantor_individuals[0].pass_issued,
            КодПодразделения: order.guarantor_individuals[0].pass_issued_code,
            МестоРождения: order.guarantor_individuals[0].birth_place,
            Гражданство:order.guarantor_individuals[0].citizenship,
            АдресРегистрации:{
                ПочтовыйИндекс:order.guarantor_individuals[0].reg_place.indx,
                Регион:order.guarantor_individuals[0].reg_place.region,
                Район:order.guarantor_individuals[0].reg_place.raion,
                НаселенныйПункт:order.guarantor_individuals[0].reg_place.punkt,
                Улица:order.guarantor_individuals[0].reg_place.street_name,
                КодУлицы:order.guarantor_individuals[0].reg_place.street_code,
                НомерДома:order.guarantor_individuals[0].reg_place.house,
                Корпус:order.guarantor_individuals[0].reg_place.corps,
                Строение:order.guarantor_individuals[0].reg_place.building,
                НомерКвартиры:order.guarantor_individuals[0].reg_place.apart_number
            },

            АдресМестаПребывания:{
                ПочтовыйИндекс:order.guarantor_individuals[0].curr_place.indx,
                Регион:order.guarantor_individuals[0].curr_place.region,
                Район:order.guarantor_individuals[0].curr_place.raion,
                НаселенныйПункт:order.guarantor_individuals[0].curr_place.punkt,
                Улица:order.guarantor_individuals[0].curr_place.street_name,
                КодУлицы:order.guarantor_individuals[0].curr_place.street_code,
                НомерДома:order.guarantor_individuals[0].curr_place.house,
                Корпус:order.guarantor_individuals[0].curr_place.corps,
                Строение:order.guarantor_individuals[0].curr_place.building,
                НомерКвартиры:order.guarantor_individuals[0].curr_place.apart_number
            },

            Телефон:order.guarantor_individuals[0].phone,
            ЭлектроннаяПочта:order.guarantor_individuals[0].email,
            СерияНомерСП:order.guarantor_individuals[0].old_pass_serial_number,
            ДатаВыдачиСП: format_date_for_datetime(order.guarantor_individuals[0].old_pass_issue_date) ,
            КемВыданСП: order.guarantor_individuals[0].old_pass_issued,
            КодПодразделенияСП: order.guarantor_individuals[0].old_pass_issued_code
        }
      end

      if order.guarantor_legals[0].present?

        order_raw[:МассивАнкет][0][:АнкетаЗаявка][:ПоручительЮЛ] = {

            Тип: order.guarantor_legals[0].type_o,
            Наименование: order.guarantor_legals[0].name,
            ПолноеНаименование: order.guarantor_legals[0].fullname,
            ИНН:order.guarantor_legals[0].inn,
            КПП: order.guarantor_legals[0].kpp,
            ОГРН: order.guarantor_legals[0].ogrn,
            ОсновнойБанковскийСчет:{
                БИК:order.guarantor_legals[0].bank_account.bank.bik,
                НомерСчета: order.guarantor_legals[0].bank_account.account_number,
                БанкНаименование: order.borrower.bank_account.bank.name,
                КоррСчет:order.guarantor_legals[0].bank_account.bank.korr_number,
                ИНН:order.guarantor_legals[0].bank_account.bank.inn,
            },
            ЮридическийАдрес:{
                ПочтовыйИндекс:order.guarantor_legals[0].address_legal.indx,
                Регион:order.guarantor_legals[0].address_legal.region,
                Район:order.guarantor_legals[0].address_legal.raion,
                НаселенныйПункт:order.guarantor_legals[0].address_legal.punkt,
                Улица:order.guarantor_legals[0].address_legal.street_name,
                КодУлицы:order.guarantor_legals[0].address_legal.street_code,
                НомерДома:order.guarantor_legals[0].address_legal.house,
                Корпус:order.guarantor_legals[0].address_legal.corps,
                Строение:order.guarantor_legals[0].address_legal.building,
                НомерКвартиры:order.guarantor_legals[0].address_legal.apart_number
            },
            ФактическийАдрес:{
                ПочтовыйИндекс:order.guarantor_legals[0].address_actual.indx,
                Регион:order.guarantor_legals[0].address_actual.region,
                Район:order.guarantor_legals[0].address_actual.raion,
                НаселенныйПункт:order.guarantor_legals[0].address_actual.punkt,
                Улица:order.guarantor_legals[0].address_actual.street_name,
                КодУлицы:order.guarantor_legals[0].address_actual.street_code,
                НомерДома:order.guarantor_legals[0].address_actual.house,
                Корпус:order.guarantor_legals[0].address_actual.corps,
                Строение:order.guarantor_legals[0].address_actual.building,
                НомерКвартиры:order.guarantor_legals[0].address_actual.apart_number
            },
            ДолжностьРуководителя:order.guarantor_legals[0].head_position,
            ДатаГосРегистрации:format_date_for_datetime(order.guarantor_legals[0].reg_date),
            ПерсональныеДанныеЗаявителя:{
                ФИО: order.guarantor_legals[0].person.fullname,
                ДатаРождения: format_date_for_datetime(order.guarantor_legals[0].person.birthday),
                СерияНомерПаспорта: order.guarantor_legals[0].person.pass_serial_number,
                ДатаВыдачи: format_date_for_datetime(order.guarantor_legals[0].person.pass_issue_date),
                КемВыдан: order.guarantor_legals[0].person.pass_issued,
                КодПодразделения: order.guarantor_legals[0].person.pass_issued_code,
                МестоРождения: order.guarantor_legals[0].person.birth_place,
                Гражданство:order.guarantor_legals[0].person.citizenship,
                АдресРегистрации:{
                    ПочтовыйИндекс:order.guarantor_legals[0].person.reg_place.indx,
                    Регион:order.guarantor_legals[0].person.reg_place.region,
                    Район:order.guarantor_legals[0].person.reg_place.raion,
                    НаселенныйПункт:order.guarantor_legals[0].person.reg_place.punkt,
                    Улица:order.guarantor_legals[0].person.reg_place.street_name,
                    КодУлицы:order.guarantor_legals[0].person.reg_place.street_code,
                    НомерДома:order.guarantor_legals[0].person.reg_place.house,
                    Корпус:order.guarantor_legals[0].person.reg_place.corps,
                    Строение:order.guarantor_legals[0].person.reg_place.building,
                    НомерКвартиры:order.guarantor_legals[0].person.reg_place.apart_number
                },
                АдресМестаПребывания:{
                    ПочтовыйИндекс:order.guarantor_legals[0].person.curr_place.indx,
                    Регион:order.guarantor_legals[0].person.curr_place.region,
                    Район:order.guarantor_legals[0].person.curr_place.raion,
                    НаселенныйПункт:order.guarantor_legals[0].person.curr_place.punkt,
                    Улица:order.guarantor_legals[0].person.curr_place.street_name,
                    КодУлицы:order.guarantor_legals[0].person.curr_place.street_code,
                    НомерДома:order.guarantor_legals[0].person.curr_place.house,
                    Корпус:order.guarantor_legals[0].person.curr_place.corps,
                    Строение:order.guarantor_legals[0].person.curr_place.building,
                    НомерКвартиры:order.guarantor_legals[0].person.curr_place.apart_number
                },
                Телефон:order.guarantor_legals[0].person.phone,
                ЭлектроннаяПочта:order.guarantor_legals[0].person.email,
                СерияНомерСП:order.guarantor_legals[0].person.old_pass_serial_number,
                ДатаВыдачиСП: format_date_for_datetime(order.guarantor_legals[0].person.old_pass_issue_date) ,
                КемВыданСП: order.guarantor_legals[0].person.old_pass_issued,
                КодПодразделенияСП: order.guarantor_legals[0].person.old_pass_issued_code,
            },
            Учередители:[]

        }

        order_raw[:МассивАнкет][0][:АнкетаЗаявка][:ПоручительЮЛ][:Учередители]

        if order.guarantor_legals[0].founders.any?
          order.guarantor_legals[0].founders.each_with_index do |glf, index|
            order_raw[:МассивАнкет][0][:АнкетаЗаявка][:ПоручительЮЛ][:Учередители] << {
                УчередительНаименование: glf.name,
                Доля: glf.share,
                ПаспортныеДанныеОГРН: glf.pass_data_ogrn
            }
          end
        end

      end


      if order.documents.any?
        order.documents.each_with_index do |d, index|
          order_raw[:МассивАнкет][0][:АнкетаЗаявка][:ДокументыИсполнителя] << {
              ТипДокументаИсполнителя: d.type_d,
              Файл: Base64.encode64( File.open(d.file.path, "rb").read ),
              Расширение: d.file.path.split(".").last
          }
        end
      end

      #binding.pry


      response = savon_client.call(:send_data, message: order_raw)

      response.http.code == 200


      #binding.pry

    else

    end

  end



  private

  def logger
    logger = Logger.new(STDOUT)
    logger.level = Logger::WARN
    logger
  end

  def format_date_for_datetime(d)

    #binding.pry

    d.to_s.to_datetime;

  end

  end
