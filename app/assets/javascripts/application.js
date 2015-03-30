// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require bootstrap
//= require bootstrap/tab
//= require turbolinks
//= require jquery.cookie
//= require_tree .



;(function($){

    'use strict';


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




    //выбор электроннй площадки
    $('#order_platform_number').on('change', function(){
        var value = $(this).val()
        $('#order_platform').val(value);
    });

    //установка площадки
    var value_platform = $('#order_platform_number').val();
    if($('#order_platform').length > 0) {
        //$('#order_platform').val(value_platform);
    }
    //смена типа заемщика при создании заявки
    $('#order_borrower_attributes_type_o').on('change', function(){

        var value = $(this).val(),
            field = $("#order_borrower_attributes_kpp"),
            fieldParent = field.parents('.field');

        if(value == "ФЛ"){
            fieldParent.addClass('hidden');
            field.data('store',field.val()).val('')
        }else{
            fieldParent.removeClass('hidden');
            field.val(field.data('store'));
        }

    });

    //смена типа поручителя запоминаем в куках
    $("input[name='service[guarantor_type]']").on('change', function(){
        var value = $(this).val();
        $('.guarantor').addClass('hidden');
        $('.guarantor.' + value).removeClass('hidden');

        //$.cookie('guarantor_type', value, { path: '/' });
    });


    //запоминаем выбранные табы заявки
    $('#order-tabs a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

        var tab_index = $(e.target).parents('li').index();
        $.cookie('order_tab', tab_index, { path: '/' });

    });

    //открываем запомненные табы
    var tab_index = $.cookie('order_tab') || 0;
    $("#order-tabs li:eq("+tab_index+") a").tab('show');



    //добавление файла
    $("#add-document, .del").on('click', function(evt){
        var button = $(this);

        //если кнопка Добавить документ
        if(button.attr('id') == "add-document") {
            var block = $('.documents .field-horizontal:last');
            block.find("input[name$='[_destroy]']").val('false');
            block.find('select').val('1')

            if(block.hasClass('hidden') && !block.hasClass('deleted')){
                block.removeClass('hidden');
            }else {
                var document = block.clone(true);
                document.removeClass('hidden deleted');
                $('.file-name', document).empty();
                $('.documents').append(document);
            }

        }else{
            var block = button.parents('.field-horizontal');
            block.find("input[name$='[_destroy]']").val('true');
            block.addClass('hidden deleted');
        }

        //проставляем индексы
        $('.documents .field-horizontal').each(function(i){
             $('select,input', $(this)).attr('name', function(){
                return $(this).attr('name').replace(/(\d)/, i);
            });

        });
    });


})(jQuery);


function formatDate(src){
    var date = new Date(src),
        y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate();

        return y + "-" + (m >= 10 ? m : "0" + m) + "-" + (d >= 10 ? d : "0" + d)
}