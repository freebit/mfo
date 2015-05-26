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
                Calculate(summa, rate, true);
            }

        });


        //считаем при смене суммы займа
        $('#service_order_summa').on('keyup, change', function (e) {
            var rate = parseFloat($('#service_order_rate').val(), 10) || 0,
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

            Calculate(summa, order_rate, true);


        });

        //считаем при смене дохода агента
        $('#service_agent_summa').on('keyup, change', function (e) {

            var summa = parseFloat($('#service_order_summa').val(), 10) || 0;

            if(summa == 0) return;

            var agent_summa = parseFloat($(this).val(), 10);


            //пересчитаем доход МФО
            var mfo_summa = ((summa/100) * window.currentTarif.rate) + ((agent_summa/100) * mfo_margin),
                order_summa = floorFigure(mfo_summa + agent_summa, 2),
                order_rate = floorFigure((order_summa/summa) * 100, 2),
                mfo_rate_fact = floorFigure((mfo_summa/summa) * 100, 2),
                agent_rate = floorFigure(agent_summa * (100/summa), 2);

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
        }


        function Calculate(summa, base_rate, by_rate_flag) {
            var by_rate = !!by_rate_flag,
                mfo_rate = window.currentTarif.rate,
                minimum = floorFigure(window.currentTarif.minimum, 2),
                agent_rate = base_rate - mfo_rate,

                dohod_summa_tarif = floorFigure(((summa / 100) * window.currentTarif.rate), 2), //посчитаем доход по тарифу
                minimalka = dohod_summa_tarif <= minimum,

                order_summa = floorFigure(((summa / 100) * base_rate), 2),
                agent_summa = 0,
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
                        agent_summa = (summa / 100) * agent_rate;
                        mfo_summa = ((summa / 100) * mfo_rate) + ((agent_summa / 100) * mfo_margin);
                        agent_summa = agent_summa - ((agent_summa / 100) * mfo_margin);

                        var mfo_margin_rate = (agent_rate / 100) * mfo_margin;
                        mfo_rate = floorFigure((mfo_rate + mfo_margin_rate), 2);
                        agent_rate = floorFigure(agent_rate - mfo_margin_rate, 2);
                    }

                    setRates(mfo_rate, agent_rate);

                }

            //если это тариф типа Б, где при победе снимается еще одна ставка
            if(dop_rate) {
                dop_summa = (summa / 100) * dop_rate;
                dop_mfo_summa = (summa / 100) * dop_mfo_rate;
                dop_agent_summa = (summa / 100) * dop_agent_rate;

                order_victory_summa = order_summa + dop_summa;
                mfo_victory_summa = mfo_summa + dop_mfo_summa;
                agent_victory_summa = agent_summa + dop_agent_summa;


            }


            //выставляем значения в калькуляторе
            $('#service_dogovor_summa_tarif').val(dohod_summa_tarif);

            $('#service_dogovor_summa').val(order_summa);

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
            $('.tarif .value.mfo_rate').text((mfo_rate || 0) + "%");
            $('.tarif .value.agent_rate').text((agent_rate || 0) + "%");
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