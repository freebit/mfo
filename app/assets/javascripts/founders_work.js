$("#borrower,#guarantor-legals-content").on('click','.btn, .del', function(evt){
    var button = $(this),
        parent = button.parents('.borrower-founders');

    //если кнопка Добавить учредителя
    if(button.hasClass('add-founder')) {

        window.mfo.addFounder(parent, true);

    }else{

        var item_number = $('.borrower-list .item:not(.hidden.deleted)', parent).length;

        if(item_number == 1) {
            $('#founder-message').modal()
        }else{
            var block = button.parents('.item');
            $("input[name$='[_destroy]']", block).val('true');
            block.addClass('hidden deleted');
        }
    }

    //проставляем индексы
    window.mfo.reindexFounders(parent);
});