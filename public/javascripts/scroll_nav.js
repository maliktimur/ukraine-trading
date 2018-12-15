$(document).ready(function(){
	    $(".scrollnav").on("click","a", function (event) {
	        event.preventDefault();
	        var id  = $(this).attr('href'),
	            top = $(id).offset().top;
	        $('body,html').animate({scrollTop: top}, 1500);
	    });
});
 
// $(document).ready(function(){
// 	$("a[href*='#']").on("click", function(e){
// 		var anchor = $(this);
// 		$('html, body').stop().animate({scrollTop: $(anchor.attr('href')).offset().top}, 1500);
// 		e.preventDefault();
// return false;
// });
// });