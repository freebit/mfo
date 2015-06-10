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
                summa = 0;


            setTarif(platform, type);

            var base_rate = window.currentTarif.rate;

            Calculate(summa, base_rate);

        });


        //считаем при смене ставки
        $('#service_order_rate').on('keyup, change', function (e) {

            var rate = parseFloat($(this).val(), 10 ) || 0,
                summa = parseFloat($('#service_order_summa').val(), 10) || 0;

            if(summa <= 0){
                alert('Укажите сумму займа')
            }else{
                Calculate(summa, rate, true);
            }

        });


        //считаем при смене суммы займа
        $('#service_order_summa').on('keyup, change', function (e) {
            var rate = window.currentTarif.rate,
                summa = parseFloat($(this).val(), 10) || 0;


            if (summa <= 0) {
                alert('Укажите сумму займа')
            } else {
                Calculate(summa, rate);
            }
        });


        //считаем при смене дохода договора
        $('#service_dogovor_summa').on('keyup, change', function(e){
            var summa = parseFloat($('#service_order_summa').val(), 10) || 0;
            if(summa == 0) return;

            var order_summa = parseFloat($(this).val(), 10),
                order_rate = (order_summa/summa) * 100;

            $('#service_order_rate').val(order_rate)

            Calculate(summa, order_rate, true, true);


        });

        //считаем при смене дохода агента
        $('#service_agent_summa').on('keyup, change', function (e) {

            var summa = parseFloat($('#service_order_summa').val(), 10) || 0,
                mfo_summa = 0;

            if(summa == 0) return;

            var dohod_summa_tarif = (summa / 100) * window.currentTarif.rate,
                minimalka = dohod_summa_tarif < window.currentTarif.minimum,
                agent_summa = parseFloat($(this).val(), 10);

            if(minimalka){
                mfo_summa = window.currentTarif.minimum + ((agent_summa*0.1)/0.9);
            }else{
                mfo_summa = ((summa/100) * window.currentTarif.rate) + ((agent_summa*0.1)/0.9);
            }

            //пересчитаем доход МФО
            var order_summa = floorFigure(mfo_summa + agent_summa, 2),
                agent_rate = floorFigure(agent_summa * (100/summa), 2),
                order_rate = floorFigure((order_summa/summa) * 100, 2),
                mfo_rate_fact = floorFigure(((mfo_summa/summa) * 100), 2);


            $('#service_mfo_summa').val( floorFigure(mfo_summa, 2) );
            $('#service_dogovor_summa').val(order_summa);
            $('#service_order_rate').val(order_rate);

            //сменим ставки
            setRates(mfo_rate_fact, agent_rate);
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

            if(window.currentTarif.personal_number_flag) {
                $('#personal-number').removeClass('hidden')
            }else{
                $('#personal-number').addClass('hidden')
            }
        }


        function Calculate(summa, base_rate, by_rate_flag, by_order_flag, by_summa_flag) {
            var by_rate = !!by_rate_flag,
                by_order = !!by_order_flag,
                by_summa = !!by_summa_flag,
                base_rate = base_rate <= 0 ? window.currentTarif.rate : base_rate,
                mfo_rate = 0,
                agent_rate = 0,
                minimum = floorFigure(window.currentTarif.minimum, 2),

                dohod_summa_tarif = floorFigure(((summa / 100) * window.currentTarif.rate), 2), //посчитаем доход по тарифу
                minimalka = dohod_summa_tarif < minimum,

                order_summa = floorFigure(((summa / 100) * base_rate), 2),
                agent_summa = 0,//parseFloat($('#service_agent_summa').val(), 10) || 0,
                mfo_summa = 0,
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

                //преобразуем по минималке
                if(summa > 0) {
                    mfo_rate = window.currentTarif.rate;
                    order_summa = order_summa > minimum ? order_summa : minimum;
                    mfo_summa = minimum;
                }

                if(minimalka){
                    if(summa > 0) {
                        agent_summa = order_summa - mfo_summa;
                        mfo_summa = mfo_summa + ((agent_summa/100) * mfo_margin);
                        mfo_summa = floorFigure(mfo_summa, 2);
                        agent_summa = agent_summa - ((agent_summa/100) * mfo_margin);
                        agent_summa = floorFigure(agent_summa, 2);

                        mfo_forminimal_rate = floorFigure((mfo_summa / summa) * 100, 2);
                        agent_forminimal_rate = floorFigure((agent_summa / summa) * 100, 2);

                        mfo_rate = floorFigure(((window.currentTarif.minimum * 100) / summa), 2);
                    }

                    setRates(mfo_forminimal_rate, agent_forminimal_rate);


                }else{
                    if(summa > 0) {
                        agent_rate = base_rate - mfo_rate;

                        var mfo_margin_rate = (agent_rate / 100) * mfo_margin;

                        agent_summa = (summa / 100) * agent_rate;
                        mfo_summa = ((summa / 100) * mfo_rate) + ((agent_summa / 100) * mfo_margin);
                        agent_summa = floorFigure(agent_summa - ((agent_summa / 100) * mfo_margin), 2);
                        agent_summa = agent_summa < 0 ? 0 : agent_summa;

                        //пересчитываем превышение
                        agent_rate = floorFigure(agent_rate - mfo_margin_rate, 2);
                        mfo_rate = floorFigure((mfo_rate + mfo_margin_rate), 2);
                    }

                    setRates(mfo_rate, agent_rate);

                }

            //если это тариф типа Б, где при победе снимается еще одна ставка
            if(dop_rate) {
                dop_summa = (summa / 100) * dop_rate;
                dop_mfo_summa = (summa / 100) * dop_mfo_rate;
                dop_agent_summa = (summa / 100) * dop_agent_rate;

                order_victory_summa = order_summa + dop_summa;
                mfo_victory_summa = dop_mfo_summa;
                agent_victory_summa = dop_agent_summa;


            }


            //выставляем значения в калькуляторе
            $('#service_dogovor_summa_tarif').val(dohod_summa_tarif);

            //by_summa && $('#service_order_summa').val(summa);

            !by_order && $('#service_dogovor_summa').val(order_summa);

            !by_rate && $('#service_order_rate').val(mfo_rate);

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
            var mfo_r = mfo_rate < 0 ? 0 : mfo_rate,
                agent_r = agent_rate < 0 ? 0 : agent_rate;

            $('.tarif .value.mfo_rate').text((mfo_r || 0) + "%");
            $('.tarif .value.agent_rate').text((agent_r || 0) + "%");
        }

        function floorFigure(figure, decimals){
            if (!decimals) decimals = 2;
            var d = Math.pow(10,decimals);
            return parseFloat((parseInt(figure*d)/d).toFixed(decimals), 10);
        };





    //калькулятор для конечных клиентов
    }else{

        //если есть список платформ
        if($('#order_platform_name').length){
            setClientTarif()
        }

        //считаем при смене платформы или типа тарифа
        $('#order_platform_name, #order_tarif_name').on('change', function () {

            setClientTarif();

            if(window.currentTarif){
                calcValue();
            }

        });

        //считаем при смене суммы
        $('#service_order_summa').on('keyup, change', function (e) {
            calcValue();
        });

        function setClientTarif() {
            var platform = $('#order_platform_name').val(),
                type = $('#order_tarif_name').val();

            for (var i = 0, ln = window.tarifs.length; i < ln; i++) {
                if (window.tarifs[i].platform == platform  && window.tarifs[i].type_t == type) {
                    window.currentTarif = window.tarifs[i];
                    break;
                }
            }

            if(window.currentTarif.client_dop_rate){
                $('.victory').removeClass('hidden');
            }else{
                $('.victory').addClass('hidden');
            }
        }

        function calcValue(){
            var summa = $('#service_order_summa').val(),
                value = (summa / 100) * window.currentTarif.client_rate,
                dop_value = 0;

            if(window.currentTarif.client_dop_rate){
                dop_value = (summa / 100) * window.currentTarif.client_dop_rate;
            }

            $('#service_dogovor_summa').val(value);
            $('#service_dogovor_victory_summa').val(dop_value);

            $('#order_tarif').val($('#order_tarif_name').val());
            $('#order_summa').val(summa);
            $('#order_dogovor_summa').val(value);

        }


    }

})(jQuery);