//работаем с поручителями (добавляем удаляем)
;(function($){

    //создаем\удаляем нового поручителя
    $('.guarantor-tabs').on('click','.add-tab, .tab-closer', function(){

        var button = $(this),
            tabs = button.parents('.guarantor-tabs'),
            firstTab = $('.tab:first', tabs),
            tabContent = tabs.next('.tab-content'),
            firstTabPane = $('.tab-pane:first', tabContent),
            countTabs = tabs.find('.tab').not('.hidden').length,
            isExist = !!$("input[name$='[id]']", firstTabPane).length, //если есть такой hidden, значит в редактируемся
            action_new = button.parents('form').hasClass('new_order'),
            type = tabs.data('type');

        //добавляем
        if( button.hasClass('add-tab') ) {

            if(window.mfo.config["maxGuarantors_" + type] == countTabs) {
                alert("Добавление нескольких поручителей одного типа временно отключено");
                return;
            }

            //если только это создание новой заявки
            if (!firstTab.hasClass('deleted') && firstTab.hasClass('hidden') && !isExist) {
                firstTab.addClass('active').removeClass('hidden');
                $('#service_active_guarantor_' + type).val(0);
            } else {
                var newTab = firstTab.clone();
                $('.tab', tabs).removeClass('active');
                newTab.addClass('active').removeClass('deleted hidden');
                button.before(newTab);
                $('#service_active_guarantor_' + type).val(newTab.index());
            }

            //добавляем таб-пане
            if (!firstTabPane.hasClass('deleted') && firstTabPane.hasClass('hidden') && !isExist) {
                window.mfo.clearFields(firstTabPane);
                firstTabPane.removeClass('hidden').addClass('active');
                $("input[name$='[_destroy]']", firstTabPane).val('false');
            } else {
                var newTabPane = firstTabPane.clone(true);
                $('.tab-pane', tabContent).removeClass('active');
                newTabPane.addClass('active').removeClass('deleted hidden');
                window.mfo.clearFields(newTabPane.not('.hidden'));

                $("input[name$='[id]']", newTabPane).remove();

                $("input[name$='[_destroy]']", newTabPane).val('false');
                tabContent.append(newTabPane);
            }

        //удаляем
        }else{

            var tab = button.parents('li'),
                index = tab.index(),
                pane = $('.tab-pane', tabContent).eq(index),
                last = tab.siblings().not('.add-tab, .hidden').length == 0,
                righted = tab.siblings().not('.add-tab, .hidden').length == index;


            if(righted && !last) {
                tab.prev('.tab:not(.add-tab):not(.hidden)').addClass('active');
                pane.prevAll('.tab-pane:not(.hidden):first').addClass('active');
                $('#service_active_guarantor_' + type).val(function(){
                    return $(this).val() - 1;
                });

            }

            if(!righted && !last){
                tab.next('.tab:not(.add-tab):not(.hidden)').addClass('active');
                pane.nextAll('.tab-pane:not(.hidden):first').addClass('active');
                $('#service_active_guarantor_' + type).val(function(){
                    return $(this).val() + 1;
                });

            }


            if(action_new && !last){
                tab.remove();
                pane.remove();
            }else{
                tab.removeClass('active').addClass('hidden' + (!last ? ' delete':''))
                pane.removeClass('active').addClass('hidden' + (!last ? ' delete':''));
                $("input[name$='[_destroy]']", pane).val('true');
            }


        }

        //перестраиваем href, id, name по порядку
        $('.tab', tabs).each(function(i){
            var tab_a = $('a', $(this)),
                tab_pane = $('.tab-pane', tabContent).eq(i);

            //
            tab_a.attr('href', function(){
               return $(this).attr('href').replace(/\d/,i);
            });

            tab_a.text(function(){
                return $(this).text().replace(/\d/,i+1);
            });

            //делаем тоже самое в таб-панах
            tab_pane.attr('id', function(){
                return $(this).attr('id').replace(/\d/, i);
            });

            $('input', tab_pane).attr('name', function(){
                return $(this).attr('name').replace(/\d/, i);
            });
        });

    });


    //запоминаем активные табы
    $('.guarantor-tabs').on('shown.bs.tab','a[data-toggle="tab"]', function (e) {

        var tab_index = $(e.target).parents('li:not(.add-tab):not(:hidden)').index(),
            type = $(e.target).parents('ul').data('type');

        $('#service_active_guarantor_' + type).val(tab_index);

    });




})(jQuery);


function addGuarantor(type, data){

    var tabs = $('.guarantor-tabs[data-type='+type+']'),
        firstTab = $('.tab:first', tabs),
        tabContent = tabs.next('.tab-content'),
        firstTabPane = $('.tab-pane:first', tabContent),
        countTabs = tabs.find('.tab').not('.hidden').length,
        isExist = !!$("input[name$='[id]']", firstTabPane).length, //если есть такой hidden, значит редактируемся
        button = $('.add-tab', tabs),
        type = type;//tabs.data('type');


    //если только это создание новой заявки
    if (!firstTab.hasClass('deleted') && firstTab.hasClass('hidden') && !isExist) {
        firstTab.addClass('active').removeClass('hidden');
        $('#service_active_guarantor_' + type).val(0);
    } else {
        var newTab = firstTab.clone();
        $('.tab', tabs).removeClass('active');
        newTab.addClass('active').removeClass('deleted hidden');
        button.before(newTab);
        $('#service_active_guarantor_' + type).val(newTab.index());
    }

    //добавляем таб-пане
    if (!firstTabPane.hasClass('deleted') && firstTabPane.hasClass('hidden') && !isExist) {
        window.mfo.clearFields(firstTabPane);
        firstTabPane.removeClass('hidden').addClass('active');
        $("input[name$='[_destroy]']", firstTabPane).val('false');
    } else {
        var newTabPane = firstTabPane.clone(true);
        $('.tab-pane', tabContent).removeClass('active');
        newTabPane.addClass('active').removeClass('deleted hidden');
        window.mfo.clearFields(newTabPane.not('.hidden'));

        $("input[name$='[id]']", newTabPane).remove();

        $("input[name$='[_destroy]']", newTabPane).val('false');
        tabContent.append(newTabPane);
    }

    //перестраиваем href, id, name по порядку
    $('.tab', tabs).each(function(i){
        var tab_a = $('a', $(this)),
            tab_pane = $('.tab-pane', tabContent).eq(i);

        //
        tab_a.attr('href', function(){
            return $(this).attr('href').replace(/\d/,i);
        });

        tab_a.text(function(){
            return $(this).text().replace(/\d/,i+1);
        });

        //делаем тоже самое в таб-панах
        tab_pane.attr('id', function(){
            return $(this).attr('id').replace(/\d/, i);
        });

        $('input', tab_pane).attr('name', function(){
            return $(this).attr('name').replace(/\d/, i);
        });
    });
}
