
//добавление\удаление файла
$("#documents").on('click','.btn, .del', function(evt){
    var button = $(this);

    //если кнопка Добавить документ
    if(button.attr('id') == "add-document") {

        var block = $('.documents .field-horizontal:last');
        block.find("input[name$='[_destroy]']").val('false');


        if(block.hasClass('hidden') && !block.hasClass('deleted')){
            block.removeClass('hidden');
        }else {
            var document = block.clone();
            $('select', document).val('1');
            document.removeClass('hidden deleted');
            $('.file-name', document).empty();
            $('.documents').append(document);
        }

        $('#documents .help-block').addClass('hidden');

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