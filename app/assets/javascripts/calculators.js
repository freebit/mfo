;(function($) {

    'use strict';

    //выставляем тариф по умолчанию
    if ($('#order_tarif_name').length) {
        setTarif();

        var summa = parseFloat($('#service_order_summa').val(), 10) || 0,
            base_rate = parseFloat($('#service_order_rate').val(), 10) || 0;

        //считаем, если указана ставка
        if (base_rate > 0) {
            calcTender(summa, base_rate);
        }

    }

    //считаем при смене типа тарифа
    $('#order_platform_name, #order_tarif_name').on('change', function(){
        var platform = $('#order_platform_name').val(),
            type = $('#order_tarif_name').val(),
            summa = parseFloat($('#service_order_summa').val(), 10) || 0,
            base_rate = parseFloat($('#service_order_rate').val(), 10) || 0

        setTarif(platform, type);

        if(summa <= 0){
            alert('Укажите сумму займа')
        }else {
            calcTender(summa, base_rate);
        }
    });


    //считаем при смене ставки
    $('#service_order_rate').on('keyup, change', function(e){

       // if((e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode == 37 || e.keyCode == 8) return;

        var rate = parseFloat( $(this).val(), 10) || 0,
            mfo_rate = window.currentTarif.rate,
            summa = parseFloat($('#service_order_summa').val(), 10) || 0;


        if(summa <= 0){
            alert('Укажите сумму займа')
        }else{
            //выставляем новую ставку агента
            $('.tarif .value.agent_rate').text((rate - mfo_rate).toPrecision(3) + "%");


            calcTender(summa, rate);
        }

    });


    //считаем при смене суммы
    $('#service_order_summa').on('keyup, change', function(e){
        var rate = parseFloat( $('#service_order_rate').val(), 10) || 0,
            summa = parseFloat($(this).val(), 10) || 0;


        if(summa <= 0){
            alert('Укажите сумму займа')
        }else{

            calcTender(summa, rate);
        }
    });



    function setTarif(platform, type){
        //alert('setTarif')
        var platform = platform || $('#order_platform_name').val(),
            type = type || $('#order_tarif_name').val(),
            base_rate = parseInt($('#service_order_rate').val(), 10) || 0,
            mfo_rate = 0,
            agent_rate = 0;

        for(var i= 0,ln = window.tarifs.length; i < ln; i++){
            if(window.tarifs[i].platform == platform && window.tarifs[i].type_t == type){
                window.currentTarif = window.tarifs[i];
                mfo_rate = window.currentTarif.rate;
                break;
            }
        }

        //выставляем ставку банка
        $('.tarif .value.mfo_rate').text(mfo_rate + "%");

        //считаем ставку агента
        if(base_rate > mfo_rate){
            agent_rate = base_rate - mfo_rate;
        }
        $('.tarif .value.agent_rate').text(agent_rate + "%");
    }


    function calcTender(summa, base_rate){
        var mfo_rate = window.currentTarif.rate,
            mfo_margin = 10,
            dop_rate = window.currentTarif.dop_rate,
            agent_rate = base_rate - mfo_rate,
            order_summa = (summa / 100) * base_rate,
            agent_summa = (summa / 100) * agent_rate,
            mfo_summa = (summa / 100) * mfo_rate,
            full_mfo_summa = mfo_summa + ((agent_summa/100) * mfo_margin),
            full_agent_summa = agent_summa - ((agent_summa/100) * mfo_margin);

            //если это тариф типа Б, где при победе снимается еще одна ставка
            if(dop_rate > 0){
                var dop_summa = (summa / 100) * dop_rate,
                    dop_mfo_rate = 1.5,
                    dop_agent_rate = 0.5,
                    dop_mfo_summa = (summa / 100) * dop_mfo_rate,
                    dop_agent_summa = (summa / 100) * dop_agent_rate;

                order_summa += dop_summa
                full_mfo_summa += dop_mfo_summa;
                full_agent_summa += dop_agent_summa;
             }

        //сумма МФО не должна быть меньше указанного минимума
        full_mfo_summa = full_mfo_summa < window.currentTarif.minimum ? window.currentTarif.minimum : full_mfo_summa

        //выставляем значения в калькуляторе
        $('#service_dogovor_summa').val(order_summa);
        $('#service_mfo_summa').val(full_mfo_summa);
        $('#service_agent_summa').val(full_agent_summa);

        //выставляем значения в заявке
        $('#order_tarif').val( $('#order_tarif_name').val() );
        $('#order_base_rate').val(base_rate);
        $('#order_summa').val(summa);
        $('#order_dogovor_summa').val(order_summa);
        $('#order_mfo_summa').val(full_mfo_summa);
        $('#order_agent_summa').val(full_agent_summa);

    }

})(jQuery);