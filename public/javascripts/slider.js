$(document).ready(function(){
    $('.cars_slider').on('swipe', function(event, slick, direction){
    	// console.log(direction);
        dots: true,
 	 	// infinite: false,
		speed: 300,
		slidesToShow: 1,
		slidesToScroll: 1
      });
});