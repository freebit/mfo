;(function($){

    var targetForm = $("[data-formtype=check-borrower]"),
        activeFields = $('#borrower input:not(#order_borrower_attributes_inn,#order_borrower_attributes_kpp)');

    targetForm.on('ajax:success', function(e, data, status, xhr){

        console.log(data);

        $('#borrower-indicator').addClass('hidden')

        if(data['status'] == "error") {
            $('#borrower-indicator').removeClass('hidden').addClass('message').text(data['message']);
            activeFields.removeClass('wait-data').addClass('fill-data');
            return;
        }else if(!data.data['Клиент']){
            $('#borrower-indicator').removeClass('hidden').addClass('message').text('Не найдено');
            activeFields.removeClass('wait-data').addClass('fill-data');
            return;
        }



        var client = data.data['Клиент'],
            guarantors_individual = data.data['ПоручителиФЛ'],
            guarantors_legal = data.data['ПоручителиЮЛ'],
            legal_addres = client['ЮридическийАдрес'],
            actual_addres = client['ФактическийАдрес'];

        //console.log(client);
        console.log(window.mfo.formatDate(client['ДатаГосРегистрации']));

        //организация
        //$('#order_borrower_attributes_type_o').val( data['Тип'] );

        $('#order_borrower_attributes_name').val( client['Наименование'] );
        $('#order_borrower_attributes_fullname').val( client['ПолноеНаименование'] );
        $('#order_borrower_attributes_ogrn').val( client['ОГРН'] );

        //адрес, блин, юридический
        $('#order_borrower_attributes_address_legal_attributes_indx').val( legal_addres['ПочтовыйИндекс'] );
        $('#order_borrower_attributes_address_legal_attributes_region').val( legal_addres['Регион'] );
        $('order_borrower_attributes_address_legal_attributes_raion').val( legal_addres['Район'] );
        $('order_borrower_attributes_address_legal_attributes_punkt').val( legal_addres['НаселенныйПункт'] );
        $('#order_borrower_attributes_address_legal_attributes_street_code').val( legal_addres['КодУлицы'] );
        $('#order_borrower_attributes_address_legal_attributes_street_name').val( legal_addres['Улица'] );
        $('#order_borrower_attributes_address_legal_attributes_house').val( legal_addres['НомерДома'] );
        $('#order_borrower_attributes_address_legal_attributes_corps').val( legal_addres['Корпус'] );
        $('#order_borrower_attributes_address_legal_attributes_building').val( legal_addres['Строение'] );
        $('#order_borrower_attributes_address_legal_attributes_apart_number').val( legal_addres['НомерКвартиры'] );

        //хошь тебе фактический
        $('#order_borrower_attributes_address_actual_attributes_indx').val( actual_addres['ПочтовыйИндекс'] );
        $('#order_borrower_attributes_address_actual_attributes_region').val( actual_addres['Регион'] );
        $('order_borrower_attributes_address_actual_attributes_raion').val( actual_addres['Район'] );
        $('order_borrower_attributes_address_actual_attributes_punkt').val( actual_addres['НаселенныйПункт'] );
        $('#order_borrower_attributes_address_actual_attributes_street_code').val( actual_addres['КодУлицы'] );
        $('#order_borrower_attributes_address_actual_attributes_street_name').val( actual_addres['Улица'] );
        $('#order_borrower_attributes_address_actual_attributes_house').val( actual_addres['НомерДома'] );
        $('#order_borrower_attributes_address_actual_attributes_corps').val( actual_addres['Корпус'] );
        $('#order_borrower_attributes_address_actual_attributes_building').val( actual_addres['Строение'] );
        $('#order_borrower_attributes_address_actual_attributes_apart_number').val( actual_addres['НомерКвартиры'] );




        $('#order_borrower_attributes_head_position').val( client['ДолжностьРуководителя'] );
        $('#order_borrower_attributes_reg_date').val( window.mfo.formatDate(client['ДатаГосРегистрации']) );

        //учредитель
        if(client['Учередители']) {
            $('#borrower .founders-list .item:not(:first)').remove();
            var parent = $('#borrower .borrower-founders');

            $('#order_borrower_attributes_borrower_founders_attributes_0_name').val(client['Учередители'][0]['УчередительНаименование']);
            $('#order_borrower_attributes_borrower_founders_attributes_0_pass_data_ogrn').val(client['Учередители'][0]['ПаспортныеДанныеОГРН']);
            $('#order_borrower_attributes_borrower_founders_attributes_0_share').val(client['Учередители'][0]['Доля']);

            for(var i = 1,ln = client['Учередители'].length; i < ln; i++){
                window.mfo.addFounder(parent, client['Учередители'][i]);
            }

            window.mfo.reindexFounders(parent);
        }

        //Банковский счет
        $('#order_borrower_attributes_bank_account_attributes_account_number').val( client['ОсновнойБанковскийСчет']['НомерСчета'] );
        $('#order_borrower_attributes_bank_account_attributes_bank_attributes_bik').val( client['ОсновнойБанковскийСчет']['БИК'] );
        $('#order_borrower_attributes_bank_account_attributes_bank_attributes_korr_number').val( client['ОсновнойБанковскийСчет']['КоррСчет'] );
        $('#order_borrower_attributes_bank_account_attributes_bank_attributes_inn').val( client['ОсновнойБанковскийСчет']['ИНН'] );
        $('#order_borrower_attributes_bank_account_attributes_bank_attributes_name').val( client['ОсновнойБанковскийСчет']['БанкНаименование'] );

        //Персональные данные заемщика
        if(client['ПерсональныеДанныеЗаявителя']) {
            $('#order_borrower_attributes_person_attributes_fullname').val(client['ПерсональныеДанныеЗаявителя']['ФИО']);
            $('#order_borrower_attributes_person_attributes_birthday').val(window.mfo.formatDate(client['ПерсональныеДанныеЗаявителя']['ДатаРождения']));
            $('#order_borrower_attributes_person_attributes_birth_place').val(client['ПерсональныеДанныеЗаявителя']['МестоРождения']);
            $('#order_borrower_attributes_person_attributes_citizenship').val(client['ПерсональныеДанныеЗаявителя']['Гражданство']);
            $('#order_borrower_attributes_person_attributes_phone').val(client['ПерсональныеДанныеЗаявителя']['Телефон']);
            $('#order_borrower_attributes_person_attributes_email').val(client['ПерсональныеДанныеЗаявителя']['ЭлектроннаяПочта']);
            $('#order_borrower_attributes_person_attributes_reg_place').val(client['ПерсональныеДанныеЗаявителя']['АдресРегистрации']);
            $('#order_borrower_attributes_person_attributes_curr_place').val(client['ПерсональныеДанныеЗаявителя']['АдресМестаПребывания']);


            //Адрес регистрации
            $('#order_borrower_attributes_person_attributes_reg_place_attributes_indx').val(client['ПерсональныеДанныеЗаявителя']['АдресРегистрации']['ПочтовыйИндекс']);
            $('#order_borrower_attributes_person_attributes_reg_place_attributes_raion').val(client['ПерсональныеДанныеЗаявителя']['АдресРегистрации']['Район']);
            $('#order_borrower_attributes_person_attributes_reg_place_attributes_street_code').val(client['ПерсональныеДанныеЗаявителя']['АдресРегистрации']['КодУлицы']);
            $('#order_borrower_attributes_person_attributes_reg_place_attributes_region').val(client['ПерсональныеДанныеЗаявителя']['АдресРегистрации']['Регион']);
            $('#order_borrower_attributes_person_attributes_reg_place_attributes_punkt').val(client['ПерсональныеДанныеЗаявителя']['АдресРегистрации']['НаселенныйПункт']);
            $('#order_borrower_attributes_person_attributes_reg_place_attributes_street_name').val(client['ПерсональныеДанныеЗаявителя']['АдресРегистрации']['Улица']);
            $('#order_borrower_attributes_person_attributes_reg_place_attributes_house').val(client['ПерсональныеДанныеЗаявителя']['АдресРегистрации']['НомерДома']);
            $('#order_borrower_attributes_person_attributes_reg_place_attributes_corps').val(client['ПерсональныеДанныеЗаявителя']['АдресРегистрации']['Корпус']);
            $('#order_borrower_attributes_person_attributes_reg_place_attributes_building').val(client['ПерсональныеДанныеЗаявителя']['АдресРегистрации']['Строение']);
            $('#order_borrower_attributes_person_attributes_reg_place_attributes_apart_number').val(client['ПерсональныеДанныеЗаявителя']['АдресРегистрации']['НомерКвартиры']);

            //Адрес пребывания
            $('#order_borrower_attributes_person_attributes_curr_place_attributes_indx').val(client['ПерсональныеДанныеЗаявителя']['АдресМестаПребывания']['ПочтовыйИндекс']);
            $('#order_borrower_attributes_person_attributes_curr_place_attributes_raion').val(client['ПерсональныеДанныеЗаявителя']['АдресМестаПребывания']['Район']);
            $('#order_borrower_attributes_person_attributes_curr_place_attributes_street_code').val(client['ПерсональныеДанныеЗаявителя']['АдресМестаПребывания']['КодУлицы']);
            $('#order_borrower_attributes_person_attributes_curr_place_attributes_region').val(client['ПерсональныеДанныеЗаявителя']['АдресМестаПребывания']['Регион']);
            $('#order_borrower_attributes_person_attributes_curr_place_attributes_punkt').val(client['ПерсональныеДанныеЗаявителя']['АдресМестаПребывания']['НаселенныйПункт']);
            $('#order_borrower_attributes_person_attributes_curr_place_attributes_street_name').val(client['ПерсональныеДанныеЗаявителя']['АдресМестаПребывания']['Улица']);
            $('#order_borrower_attributes_person_attributes_curr_place_attributes_house').val(client['ПерсональныеДанныеЗаявителя']['АдресМестаПребывания']['НомерДома']);
            $('#order_borrower_attributes_person_attributes_curr_place_attributes_corps').val(client['ПерсональныеДанныеЗаявителя']['АдресМестаПребывания']['Корпус']);
            $('#order_borrower_attributes_person_attributes_curr_place_attributes_building').val(client['ПерсональныеДанныеЗаявителя']['АдресМестаПребывания']['Строение']);
            $('#order_borrower_attributes_person_attributes_curr_place_attributes_apart_number').val(client['ПерсональныеДанныеЗаявителя']['АдресМестаПребывания']['НомерКвартиры']);

            //Паспортные данные
            $('#order_borrower_attributes_person_attributes_pass_serial_number').val(client['ПерсональныеДанныеЗаявителя']['СерияНомерПаспорта']);
            $('#order_borrower_attributes_person_attributes_pass_issued').val(client['ПерсональныеДанныеЗаявителя']['КемВыдан']);
            $('#order_borrower_attributes_person_attributes_pass_issued_code').val(client['ПерсональныеДанныеЗаявителя']['КодПодразделения']);
            $('#order_borrower_attributes_person_attributes_pass_issue_date').val(window.mfo.formatDate(client['ПерсональныеДанныеЗаявителя']['ДатаВыдачи']));

            //Ранее выданные паспорта
            $('#order_borrower_attributes_person_attributes_old_pass_serial_number').val(client['ПерсональныеДанныеЗаявителя']['СерияНомерСП']);
            $('#order_borrower_attributes_person_attributes_old_pass_issued').val(client['ПерсональныеДанныеЗаявителя']['КемВыданСП']);
            $('#order_borrower_attributes_person_attributes_old_pass_issued_code').val(client['ПерсональныеДанныеЗаявителя']['КодПодразделенияСП']);
            $('#order_borrower_attributes_person_attributes_old_pass_issue_date').val(window.mfo.formatDate(client['ПерсональныеДанныеЗаявителя']['ДатаВыдачиСП']));
        }

        //плавно отображаем данные
        activeFields.removeClass('wait-data').addClass('fill-data');

        //window.mfo.addGuarantors( guarantors_individual, guarantors_legal );
        //addGuarantor('individual', guarantors_individual[0]);
        //addGuarantor('legal', guarantors_legal[0]);


    });

    $("[data-targetform=check-borrower]").on('click', function(){

        //console.log('chec b');

        $('[name=inn]', targetForm).val( $('#order_borrower_attributes_inn').val() );
        $('[name=kpp]', targetForm).val( $('#order_borrower_attributes_kpp').val() );

        $('#borrower-indicator').text('').removeClass('message').removeClass('hidden');

        activeFields.removeClass('fill-data').addClass('wait-data');


        targetForm.submit();
    });

})(jQuery);
