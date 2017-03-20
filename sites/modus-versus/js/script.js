$(document).ready(function() {
  $("#demo").owlCarousel({
      autoPlay: 3000, //Set AutoPlay to 3 seconds
      items: 1
  }); // end carousel
  $('#clientCarousel').owlCarousel({
    autoPlay: 2500,
    items: 3
  }) // end carousel
  $('.searchForm').hide();
  $('#search').click(function() {
    $('.searchForm').slideToggle(1000);
  }); //click end
}); // end ready
