var timer = null;

function hideError(){

    // очищаем таймер
    if (timer != null){
        window.clearTimeout(timer);
    }

    // таймаут на 5 секунд
    timer = window.setTimeout(function(){
        $('.error-holder').fadeOut();
    }, 5000);
} // end hideError

//showError - показать сообщение об ошибке//
function showError(text, top){

    $('.error-holder').removeClass('error-holder-success');
    $('.error-holder').css({"top":"" + top + "px", "z-index":"999999"});
    $('.error-holder span').text(text);

    $('.error-holder').fadeIn(function(){
        hideError();
    });
} // end showError

//showSuccess - сообщение об успешном завершении //
function showSuccess(text, top){

    $('.error-holder').addClass('error-holder-success');
    $('.error-holder').css({"top":"" + top + "px", "z-index":"999999"});
    $('.error-holder span').text(text);

    $('.error-holder').fadeIn(function(){
        hideError();
    });
} // end showSuccess

$(document).ready(function(){

    //=============== Скрыть сообщение по клику =================//
    $('.error-holder').on("click", function(){
        $(this).fadeOut();
    });

}); // end ready
