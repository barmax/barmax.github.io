
$(window).on('load', function() {

  var winHeight = $(document).height(); // высота документа
  var step = 5; // скорость скрола
  var timeToTop = winHeight/step; // время прокрутки страницы

  $('.scrolltop').on('click', function() {
    $('html, body').animate({
      scrollTop: 0
    }, timeToTop); // end animate
  }); // end on

}); // end on(load)
    // скрипт включатся после загрузки всего контента страницы
    //  необходимо для верного расчета высоты страницы
    $(document).ready(function() {

          $('body').on('click', '.more', function() {
            var button = $(this);
            var container = $('.article-holder'); // контейнер для вставки статей
            var postLink = '/'; // ссылка для запроса "больше статей"

            if (!button.hasClass('working')) {
              button.addClass('working');


            // атрибуты для передачи данных
            var data = {};
            data.action = 'more';

            // ajax-запрос
            $.ajax({
              url: postLink,
              type: 'POST',
              dataType: 'json',
              data: data,
              success: function (data) {
              },
              error: function (data) {
                button.removeClass('working');
              }
            }).done(function (data) {
              // результаты бэкенда
              // data.html - массив статей для вставки
              //  data.last - нужна ли кнопка "больше"
              container.append(data.html);
              if (data.last) {
                button.removeClass('working');
              } else {
                button.remove();
              }
            }); // end done
          }
        }); //end on
        }); // end ready
