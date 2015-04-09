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
//#= require turbolinks
//= require_tree .

window.mfo = {

    config:{

        maxGuarantors_individual: 1
        ,maxGuarantors_legal: 1
    }

    ,formatDate: function(src){
        var date = new Date(src),
            y = date.getFullYear(),
            m = date.getMonth() + 1,
            d = date.getDate();

        return y + "-" + (m >= 10 ? m : "0" + m) + "-" + (d >= 10 ? d : "0" + d)
    }

    ,clearFields: function(parent) {
        $('input', parent).val('');
    }

    ,addGuarantors: function(list){

    }
}


;(function($){

    'use strict';

    //выбор электроннй площадки
    $('#order_platform_name').on('change', function(){
        var value = $(this).val()
        $('#order_platform').val(value);
    });

    //установка площадки
    var value_platform = $('#order_platform_name').val();
    if($('#order_platform').length > 0) {
        $('#order_platform').val(value_platform);
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


    //запоминаем выбранные табы заявки в hidden полях
    $('#order-tabs a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

        var tab_name = $(e.target).attr('href').replace(/#/, "");

        $("#service_new_order_active_tab").val(tab_name);
        $("#service_edit_order_active_tab").val(tab_name);


    });




    //обработка нажатия пунктов меню при создании/редактировании заявок
    $('#order-menu').on('click','li', function(){
        var button = $(this),
            service_mfo_field = $('#service_send_mfo');
        if(button.hasClass('send_mfo')){
            service_mfo_field.val(true);
            service_mfo_field.parents('form').submit();
        }else if(button.hasClass('save')){
            service_mfo_field.val(false);
            service_mfo_field.parents('form').submit();
        }
    });

})(jQuery);

