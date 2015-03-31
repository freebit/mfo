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

            if(!data['Тип']) {

                return;
            }

            //организация
            //$('#order_borrower_attributes_type_o').val( data['Тип'] );
            $('#order_borrower_attributes_name').val( data['Наименование'] );
            $('#order_borrower_attributes_fullname').val( data['ПолноеНаименование'] );
            $('#order_borrower_attributes_ogrn').val( data['ОГРН'] );
            $('#order_borrower_attributes_address_legal').val( data['ЮридическийАдрес'] );
            $('#order_borrower_attributes_address_actual').val( data['ФактическийАдрес'] );
            $('#order_borrower_attributes_head_position').val( data['ДолжностьРуководителя'] );
            $('#order_borrower_attributes_reg_date').val( formatDate(data['ДатаГосРегистрации']) );

            //учредитель
            $('#order_borrower_attributes_founder_attributes_name').val( data['Учередители']['УчередительНаименование'] );
            $('#order_borrower_attributes_founder_attributes_pass_data_ogrn').val( data['Учередители']['ПаспортныеДанныеОГРН'] );
            $('#order_borrower_attributes_founder_attributes_share').val( data['Учередители']['Доля'] );

            //Банковский счет
            $('#order_borrower_attributes_bank_account_attributes_account_number').val( data['ОсновнойБанковскийСчет']['НомерСчета'] );
            $('#order_borrower_attributes_bank_account_attributes_bank_attributes_bik').val( data['ОсновнойБанковскийСчет']['БИК'] );
            $('#order_borrower_attributes_bank_account_attributes_bank_attributes_korr_number').val( data['ОсновнойБанковскийСчет']['КоррСчет'] );
            $('#order_borrower_attributes_bank_account_attributes_bank_attributes_inn').val( data['ОсновнойБанковскийСчет']['ИНН'] );
            $('#order_borrower_attributes_bank_account_attributes_bank_attributes_name').val( data['ОсновнойБанковскийСчет']['БанкНаименование'] );

            //Персональные данные заемщика
            $('#order_borrower_attributes_person_attributes_fullname').val( data['ПерсональныеДанныеЗаявителя']['ФИО'] );
            $('#order_borrower_attributes_person_attributes_birthday').val( formatDate(data['ПерсональныеДанныеЗаявителя']['ДатаРождения']) );
            $('#order_borrower_attributes_person_attributes_birth_place').val( data['ПерсональныеДанныеЗаявителя']['МестоРождения'] );
            $('#order_borrower_attributes_person_attributes_citizenship').val( data['ПерсональныеДанныеЗаявителя']['Гражданство'] );
            $('#order_borrower_attributes_person_attributes_phone').val( data['ПерсональныеДанныеЗаявителя']['Телефон'] );
            $('#order_borrower_attributes_person_attributes_email').val( data['ПерсональныеДанныеЗаявителя']['ЭлектроннаяПочта'] );
            $('#order_borrower_attributes_person_attributes_reg_place').val( data['ПерсональныеДанныеЗаявителя']['АдресРегистрации'] );
            $('#order_borrower_attributes_person_attributes_curr_place').val( data['ПерсональныеДанныеЗаявителя']['АдресМестаПребывания'] );

            //Паспортные данные
            $('#order_borrower_attributes_person_attributes_pass_serial_number').val( data['ПерсональныеДанныеЗаявителя']['СерияНомерПаспорта'] );
            $('#order_borrower_attributes_person_attributes_pass_issued').val( data['ПерсональныеДанныеЗаявителя']['КемВыдан'] );
            $('#order_borrower_attributes_person_attributes_pass_issued_code').val( data['ПерсональныеДанныеЗаявителя']['КодПодразделения'] );
            $('#order_borrower_attributes_person_attributes_pass_issue_date').val( formatDate(data['ПерсональныеДанныеЗаявителя']['ДатаВыдачи']) );

            //Ранее выданные паспорта
            $('#order_borrower_attributes_person_attributes_old_pass_serial_number').val( data['ПерсональныеДанныеЗаявителя']['СерияНомерСП'] );
            $('#order_borrower_attributes_person_attributes_old_pass_issued').val( data['ПерсональныеДанныеЗаявителя']['КемВыданСП'] );
            $('#order_borrower_attributes_person_attributes_old_pass_issued_code').val( data['ПерсональныеДанныеЗаявителя']['КодПодразделенияСП'] );
            $('#order_borrower_attributes_person_attributes_old_pass_issue_date').val( formatDate(data['ПерсональныеДанныеЗаявителя']['ДатаВыдачиСП']) );

            //плавно отображаем данные
            activeFields.removeClass('wait-data').addClass('fill-data');
        });

        targetForm.submit();
    });

})(jQuery)

function formatDate(src){

    var date = new Date(src),
        y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate();

    return y + "-" + (m >= 10 ? m : "0" + m) + "-" + (d >= 10 ? d : "0" + d)
}
