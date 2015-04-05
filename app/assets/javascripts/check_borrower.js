;(function($){

    $("[data-targetform]").on('click', function(){

        var target = $(this).data('targetform'),
            ownerForm = $(this).parents('form'),
            targetForm = $("[data-formtype="+target+"]"),
            activeFields = $('#borrower input:not(#order_borrower_attributes_inn,#order_borrower_attributes_kpp)');

        $('[name=inn]', targetForm).val( $('#order_borrower_attributes_inn').val() );
        $('[name=kpp]', targetForm).val( $('#order_borrower_attributes_kpp').val() );

        $('#borrower-indicator').removeClass('hidden');

        activeFields.removeClass('fill-data').addClass('wait-data');


        targetForm.on('ajax:success', function(e, data, status, xhr){

            console.log(data);

            $('#borrower-indicator').addClass('hidden');

            if(!data['Клиент']['Тип']) {
                return;
            }

            var client = data['Клиент'],
                guarantors_individual = data['ПоручителиФЛ'],
                guarantors_legal = data['ПоручителиФЛ'];

            //организация
            //$('#order_borrower_attributes_type_o').val( data['Тип'] );
            $('#order_borrower_attributes_name').val( client['Наименование'] );
            $('#order_borrower_attributes_fullname').val( client['ПолноеНаименование'] );
            $('#order_borrower_attributes_ogrn').val( client['ОГРН'] );
            $('#order_borrower_attributes_address_legal').val( client['ЮридическийАдрес'] );
            $('#order_borrower_attributes_address_actual').val( client['ФактическийАдрес'] );
            $('#order_borrower_attributes_head_position').val( client['ДолжностьРуководителя'] );
            $('#order_borrower_attributes_reg_date').val( window.mfo.formatDate(client['ДатаГосРегистрации']) );

            //учредитель
            $('#order_borrower_attributes_founder_attributes_name').val( client['Учередители']['УчередительНаименование'] );
            $('#order_borrower_attributes_founder_attributes_pass_data_ogrn').val( client['Учередители']['ПаспортныеДанныеОГРН'] );
            $('#order_borrower_attributes_founder_attributes_share').val( client['Учередители']['Доля'] );

            //Банковский счет
            $('#order_borrower_attributes_bank_account_attributes_account_number').val( client['ОсновнойБанковскийСчет']['НомерСчета'] );
            $('#order_borrower_attributes_bank_account_attributes_bank_attributes_bik').val( client['ОсновнойБанковскийСчет']['БИК'] );
            $('#order_borrower_attributes_bank_account_attributes_bank_attributes_korr_number').val( client['ОсновнойБанковскийСчет']['КоррСчет'] );
            $('#order_borrower_attributes_bank_account_attributes_bank_attributes_inn').val( client['ОсновнойБанковскийСчет']['ИНН'] );
            $('#order_borrower_attributes_bank_account_attributes_bank_attributes_name').val( client['ОсновнойБанковскийСчет']['БанкНаименование'] );

            //Персональные данные заемщика
            $('#order_borrower_attributes_person_attributes_fullname').val( client['ПерсональныеДанныеЗаявителя']['ФИО'] );
            $('#order_borrower_attributes_person_attributes_birthday').val( window.mfo.formatDate(client['ПерсональныеДанныеЗаявителя']['ДатаРождения']) );
            $('#order_borrower_attributes_person_attributes_birth_place').val( client['ПерсональныеДанныеЗаявителя']['МестоРождения'] );
            $('#order_borrower_attributes_person_attributes_citizenship').val( client['ПерсональныеДанныеЗаявителя']['Гражданство'] );
            $('#order_borrower_attributes_person_attributes_phone').val( client['ПерсональныеДанныеЗаявителя']['Телефон'] );
            $('#order_borrower_attributes_person_attributes_email').val( client['ПерсональныеДанныеЗаявителя']['ЭлектроннаяПочта'] );
            $('#order_borrower_attributes_person_attributes_reg_place').val( client['ПерсональныеДанныеЗаявителя']['АдресРегистрации'] );
            $('#order_borrower_attributes_person_attributes_curr_place').val( client['ПерсональныеДанныеЗаявителя']['АдресМестаПребывания'] );

            //Паспортные данные
            $('#order_borrower_attributes_person_attributes_pass_serial_number').val( client['ПерсональныеДанныеЗаявителя']['СерияНомерПаспорта'] );
            $('#order_borrower_attributes_person_attributes_pass_issued').val( client['ПерсональныеДанныеЗаявителя']['КемВыдан'] );
            $('#order_borrower_attributes_person_attributes_pass_issued_code').val( client['ПерсональныеДанныеЗаявителя']['КодПодразделения'] );
            $('#order_borrower_attributes_person_attributes_pass_issue_date').val( window.mfo.formatDate(client['ПерсональныеДанныеЗаявителя']['ДатаВыдачи']) );

            //Ранее выданные паспорта
            $('#order_borrower_attributes_person_attributes_old_pass_serial_number').val( client['ПерсональныеДанныеЗаявителя']['СерияНомерСП'] );
            $('#order_borrower_attributes_person_attributes_old_pass_issued').val( client['ПерсональныеДанныеЗаявителя']['КемВыданСП'] );
            $('#order_borrower_attributes_person_attributes_old_pass_issued_code').val( client['ПерсональныеДанныеЗаявителя']['КодПодразделенияСП'] );
            $('#order_borrower_attributes_person_attributes_old_pass_issue_date').val( window.mfo.formatDate( client['ПерсональныеДанныеЗаявителя']['ДатаВыдачиСП']) );

            //плавно отображаем данные
            activeFields.removeClass('wait-data').addClass('fill-data');

            window.mfo.addGuarantors( [guarantors_individual], [guarantors_legal] );
        });

        targetForm.submit();
    });

})(jQuery);
