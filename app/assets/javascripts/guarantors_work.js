//работаем с поручителями (добавляем удаляем)
;(function($){

    //создаем\удаляем нового поручителя
    $('.add-tab, .tab-closer').on('click', function(){

        var button = $(this),
            tabs = button.parents('.nav-tabs'),
            firstTab = $('.tab:first', tabs),
            tabContent = tabs.next('.tab-content'),
            firstTabPane = $('.tab-pane:first', tabContent);

        //добавляем
        if(button.hasClass('add-tab')) {
            if (!firstTab.hasClass('deleted') && firstTab.hasClass('hidden')) {
                firstTab.addClass('active').removeClass('hidden');
                $('#service_active_guarantor_individual').val(0);
            } else {
                var newTab = firstTab.clone(true);
                $('.tab', tabs).removeClass('active');
                newTab.addClass('active').removeClass('deleted hidden');
                button.before(newTab);
                $('#service_active_guarantor_individual').val(newTab.index());
            }

            //добавляем таб-пане
            if (!firstTabPane.hasClass('deleted') && firstTabPane.hasClass('hidden')) {
                firstTabPane.removeClass('hidden').addClass('active');
                $("input[name$='[_destroy]']", firstTabPane).val('false');
            } else {
                var newTabPane = firstTabPane.clone(true);
                $('.tab-pane', tabContent).removeClass('active');
                newTabPane.addClass('active').removeClass('deleted hidden');
                clearFields(newTabPane.not(':hidden'));

                $("input[name$='[_destroy]']", newTabPane).val('false');
                tabContent.append(newTabPane);
            }

        //удаляем
        }else{

            var tab = button.parents('li'),
                index = tab.index(),
                pane = $('.tab-pane', tabContent).eq(index),
                newFormFlag = pane.parents('form').hasClass('new_order');

            tab.prev('.tab').addClass('active');
            pane.prev('.tab-pane').addClass('active');

            tab.remove();

            if(newFormFlag){
                pane.remove();
            }else {
                pane.removeClass('active').addClass('hidden deleted');
                $("input[name$='[_destroy]']", pane).val('true');
            }

            //устанавливаем активным предыдущий
            $('#service_active_guarantor_individual').val(function(){
                return $(this).val() - 1;
            });
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
    $('#guarantor-individuals-tabs a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

        var tab_index = $(e.target).parents('li').index();
        $('#service_active_guarantor_individual').val(tab_index);

    });

})(jQuery);


function clearFields(parent){
    $('input', parent).val('')
}