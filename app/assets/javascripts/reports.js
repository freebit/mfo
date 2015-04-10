;(function($){

    var reportForm = $('#fetch-report-form');

    reportForm.on('submit', function(){
        $('.indicator').removeClass('hidden');
    });

    reportForm.on('ajax:success', function(e, data, status, xhr){
        $('.indicator').addClass('hidden');

        console.log(data.data);

        if(data.status == "error"){
            $('.indicator').removeClass('hidden').addClass('message').text(data.message);
        }else if(!data.data){
            $('.indicator').removeClass('hidden').addClass('message').text("Нет договоров за этот период");
        }else{
            $('.indicator').addClass('hidden').removeClass('message').text("");



            var table = $('#reports-list'),
                html = "";

            for (var i= 0,ln=data.data.length;i<ln;i++){
                var order = data.data[i],
                    d = new Date(order["Дата"]),
                    dv = new Date(order["ДатаВыдачи"]);
                html += "<tr>" +
                            "<td>" + (i+1) + "</td>" +
                            "<td>" + window.mfo.formatDate(d) + "</td>" +
                            "<td>" + window.mfo.formatDate(dv) + "</td>" +
                            "<td>" + order["ЗаемщикНаименование"] + "</td>" +
                            "<td>" + order["СуммаЗайма"] + "</td>" +
                            "<td>" + order["СуммаВознагражденияАгента"] + "</td>" +
                            "<td class='status'>" + order["СтатусСделки"] + "</td>" +
                        "</tr>";
            }

            $('tbody', table).html(html);
            table.addClass('in');

            $('#order-status').val("")

        }

    });


    $('#order-status').on('change', function(){
        var status = $(this).val();

        $('#reports-list tbody tr').each(function(i){
            var tr = $(this),
                tr_status = $('.status', tr).text().toLowerCase().trim();
            if(status && status !== tr_status){
                tr.hide(200);
            }else{
                tr.show(200);
            }

        });
    });


    function filter (phrase, _id){
        var words = [phrase];//.value.toLowerCase().split(" ");
        var table = document.getElementById(_id);
        for (var r = 1; r < table.rows.length; r++){ //сколько строк сверху не фильтровать
            var cellsV = table.rows[r].cells[0].innerHTML.replace(/<[^>]+>/g,""); // 1 столбец для фильтрации
            var cellsV = [cellsV].join(" ");
            var displayStyle = 'none';
            for (var i = 0; i < words.length; i++) {
                if (cellsV.toLowerCase().indexOf(words[i])>=0)
                    displayStyle = '';
                else {
                    displayStyle = 'none';
                    break;
                }
            }
            table.rows[r].style.display = displayStyle;
        }
    }


})(jQuery);