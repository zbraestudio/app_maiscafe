function loadURL(url){

    //alert(url);
    navigator.app.loadUrl(url, { openExternal:true });
    //window.open(url, '_system', 'location=yes');
}


$(document).ready(function() {

    $('xxxxa.externo').click(function(){

        var url = $(this).attr('href');

        loadURL(url);
        //return false;

    });

})


$(document).ready(function(){

    refresh();


    $('.refresh').click(function(){
        refresh();
    });

});

function refresh(){

    //prepara
    $('#aguarde').show();
    $('#saidaTxt').hide();
    $('#saidaTxt li').remove();

    //atualiza

    $.ajax({
        dataType: "json",
        url:'http://app.maiscafe.blog.br/chrome/json.php',
        success: function(result){

            result.forEach(function(post) {

                var li = $('<li class="ui-li-has-thumb ui-first-child"><a href="' + post.url + '" rel="external" class=" ui-btn ui-btn-icon-right ui-icon-carat-r">'+
                    '<img src="'+ post.image +'" class="ui-li-thumb">'+
                    '<h2>'+ post.title +'</h2>'+
                    '<p>Escrito por '+ post.author +'</p>'+
                    '<p>'+ post.data +'</p>'+
                    '</a></li>');

                $('#saidaTxt').append(li);
            })
            $('#aguarde').hide();
            $('#saidaTxt').show();
        }
    });

}