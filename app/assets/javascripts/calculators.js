;(function($) {

    'use strict';

    //калькулятор для админа и агентов
    if($('#calc').data('type') != 'client') {

        var mfo_margin = 10;

        //выставляем тариф по умолчанию
        if ($('#order_tarif_name').length) {
            setTarif();

            var summa = parseFloat($('#service_order_summa').val(), 10) || 0.00,
                base_rate = parseFloat($('#service_order_rate').val()) || 0.00;


            Calculate(summa, base_rate);
        }

        //считаем при смене платформы или типа тарифа
        $('#order_platform_name, #order_tarif_name').on('change', function () {
            var platform = $('#order_platform_name').val(),
                type = $('#order_tarif_name').val(),
                summa = parseFloat($('#service_order_summa').val(), 10) || 0;


            setTarif(platform, type);

            var base_rate = parseFloat($('#service_order_rate').val(), 10) || window.currentTarif.rate;

            if (summa <= 0) {
                alert('Укажите сумму займа')
            } else {
                Calculate(summa, base_rate);
            }
        });


        //считаем при смене ставки
        $('#service_order_rate').on('keyup, change', function (e) {

            // if((e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode == 37 || e.keyCode == 8) return;

            var rate = parseFloat($(this).val(), 10 ) || 0,
                summa = parseFloat($('#service_order_summa').val(), 10) || 0;

            if(summa <= 0){
                alert('Укажите сумму займа')
            }else{
                Calculate(summa, rate);
            }

        });


        //считаем при смене суммы
        $('#service_order_summa').on('keyup, change', function (e) {
            var rate = parseFloat($('#service_order_rate').val(), 10) || 0,
                summa = parseFloat($(this).val(), 10) || 0;


            if (summa <= 0) {
                alert('Укажите сумму займа')
            } else {
                Calculate(summa, rate);
            }
        });

        //считаем при смене дохода агента
        $('#service_agent_summa').on('keyup, change', function (e) {
            //alert($(this).val())
        });


        function setTarif(platform, type) {
            var platform = platform || $('#order_platform_name').val(),
                type = type || $('#order_tarif_name').val();

            for (var i = 0, ln = window.tarifs.length; i < ln; i++) {
                if (window.tarifs[i].platform == platform && window.tarifs[i].type_t == type) {
                    window.currentTarif = window.tarifs[i];
                    break;
                }
            }

            if(window.currentTarif.dop_rate){
                $('.victory').removeClass('hidden');
            }else{
                $('.victory').addClass('hidden');
            }
        }


        function Calculate(summa, base_rate) {
            var mfo_rate = window.currentTarif.rate,
                agent_rate = base_rate - mfo_rate,

                dohod_summa_tarif = (summa / 100) * window.currentTarif.rate, //посчитаем доход по тарифу
                minimalka = dohod_summa_tarif <= window.currentTarif.minimum,

                order_summa = (summa / 100) * base_rate,
                order_summa = order_summa > window.currentTarif.minimum ? order_summa : window.currentTarif.minimum,
                agent_summa = 0,
                mfo_summa = window.currentTarif.minimum,
                dop_summa = 0,
                mfo_forminimal_rate = 0,
                agent_forminimal_rate = 0,

                dop_rate = window.currentTarif.dop_rate,
                dop_mfo_rate = 1.5,
                dop_agent_rate = 0.5,
                dop_mfo_summa = 0,
                dop_agent_summa = 0,
                order_victory_summa = 0,
                mfo_victory_summa = 0,
                agent_victory_summa = 0;

                if(minimalka){
                    agent_summa = order_summa - mfo_summa;
                    mfo_summa = mfo_summa + ((agent_summa/100) * mfo_margin);
                    agent_summa = agent_summa - ((agent_summa/100) * mfo_margin);

                    mfo_forminimal_rate = (mfo_summa/summa) * 100;
                    agent_forminimal_rate = (agent_summa/summa) * 100;

                    setRates(mfo_forminimal_rate.toFixed(1), agent_forminimal_rate.toFixed(1));

                }else{
                    agent_summa = (summa / 100) * agent_rate;
                    mfo_summa = ((summa / 100) * mfo_rate) + ((agent_summa/100) * mfo_margin);
                    agent_summa = agent_summa - ((agent_summa/100) * mfo_margin);

                    var mfo_margin_rate = (agent_rate / 100) * mfo_margin;
                    mfo_rate = mfo_rate + mfo_margin_rate;
                    agent_rate = agent_rate - mfo_margin_rate;
                    setRates(mfo_rate.toFixed(1), agent_rate.toFixed(1));
                }

            //если это тариф типа Б, где при победе снимается еще одна ставка
            if(dop_rate) {
                dop_summa = (summa / 100) * dop_rate;
                dop_mfo_summa = (summa / 100) * dop_mfo_rate;
                dop_agent_summa = (summa / 100) * dop_agent_rate;

                order_victory_summa = order_summa + dop_summa;
                mfo_victory_summa = mfo_summa + dop_mfo_summa;
                agent_victory_summa = agent_summa + dop_agent_summa;

                //if(minimalka){
                //    mfo_forminimal_rate += dop_mfo_rate;
                //    agent_forminimal_rate += dop_agent_rate;
                //    setRates(mfo_forminimal_rate.toFixed(2), agent_forminimal_rate.toFixed(2));
                //}else{
                //    mfo_rate += dop_mfo_rate;
                //    agent_rate += dop_agent_rate;
                //    setRates(mfo_rate.toFixed(1), agent_rate.toFixed(1));
                //}

            }


            //выставляем значения в калькуляторе
            $('#service_dogovor_summa_tarif').val(dohod_summa_tarif);
            $('#service_dogovor_summa').val(order_summa);
            $('#service_order_rate').val(mfo_rate);
            $('#service_mfo_summa').val(mfo_summa);
            $('#service_agent_summa').val(agent_summa);

            //при победе тарифа Б
            $('#service_mfo_victory_summa').val(mfo_victory_summa);
            $('#service_agent_victory_summa').val(agent_victory_summa);

            //выставляем значения в заявке
            $('#order_tarif').val($('#order_tarif_name').val());
            $('#order_base_rate').val(base_rate);
            $('#order_summa').val(summa);
            $('#order_dogovor_summa').val(order_summa);
            $('#order_mfo_summa').val(mfo_summa);
            $('#order_agent_summa').val(agent_summa);

        }

        function setRates(mfo_rate, agent_rate){
            $('.tarif .value.mfo_rate').text((mfo_rate || 0) + "%");
            $('.tarif .value.agent_rate').text((agent_rate || 0) + "%");
        }



        function twoFixed(number){
            var strNumber = "";
            try{
                strNumber = new String(number);
            }catch(err){
                console.log(err);
            }


        }





    //калькулятор для конечных клиентов
    }else{

        //если есть список платформ
        if($('#order_platform_name').length){
            var platform = $('#order_platform_name').val();
            setClientTarif(platform)
        }

        //считаем при смене платформы или типа тарифа
        $('#order_platform_name').on('change', function () {

            setClientTarif($(this).val());

        });

        //считаем при смене суммы
        $('#service_order_summa').on('keyup, change', function (e) {
            var client_rate = window.currentTarif.client_rate;
            calcValue(client_rate);
        });

        function setClientTarif(platform) {
            var platform = platform || $('#order_platform_name').val();

            for (var i = 0, ln = window.tarifs.length; i < ln; i++) {
                if (window.tarifs[i].platform == platform) {
                    window.currentTarif = window.tarifs[i];
                    break;
                }
            }

            if(window.currentTarif){
                var client_rate = window.currentTarif.client_rate;
                calcValue(client_rate);
            }
        }

        function calcValue(rate){
            var summa = $('#service_order_summa').val(),
                value = (summa / 100) * rate;

            $('#service_dogovor_summa').val(value);

            $('#order_summa').val(summa);
            $('#order_dogovor_summa').val(value);
        }

    }

})(jQuery);