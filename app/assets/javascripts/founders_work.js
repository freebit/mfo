$("#borrower,#guarantor-legals-content").on('click','.btn, .del', function(evt){
    var button = $(this),
        parent = button.parents('.borrower-founders');

    //если кнопка Добавить учредителя
    if(button.hasClass('add-founder')) {

        var  block = $('.founders-list .item:last', parent);
        block.find("input[name$='[_destroy]']").val('false');


        if(block.hasClass('hidden') && !block.hasClass('deleted')){
            block.removeClass('hidden');
        }else {
            var founder = block.clone();
            $('input', founder).val('');
            founder.removeClass('hidden deleted');
            $('.founders-list', parent).append(founder);
        }

        //$('#documents .help-block').addClass('hidden');

    }else{

        var item_number = $('.borrower-list .item:not(.hidden.deleted)', parent).length;

        if(item_number == 1) {
            $('#founder-message').modal()
        }else{
            var block = button.parents('.item');
            block.find("input[name$='[_destroy]']").val('true');
            block.addClass('hidden deleted');
        }
    }

    //проставляем индексы
    $('.founders-list .item', parent).each(function(i){
        $('select,input', $(this)).attr('name', function(){
            return $(this).attr('name').replace(/\d(?!.*\d)/, i);
        });

    });
});