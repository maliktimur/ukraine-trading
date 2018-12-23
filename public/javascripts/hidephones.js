$.fn.textToggle = function(cls, str) {
    return this.each(function(i) {
        $(this).click(function() {
            var c = 0, el = $(cls).eq(i), arr = [str,el.text()];
            return function() {
                el.text(arr[c++ % arr.length]);
            }
        }());
    })
};
$(function(){
	$('.btn').textToggle(".txt","+380*****").click() && $('.btn').textToggle(".btn","Hide")
	// $('.btn').textToggle(".btn","Hide").click()
});



// выпадающий прикол
$(document).on("click", function(e) {
  if (e.target.id != 'dropdown' && e.target.id != 'dropdown-child' && e.target.id != 'mainmenubtn' && e.target.id != 'btn2') {
    $("#dropdown-child").hide();
  } else if (e.target.id != 'dropdown-child') {
    $("#dropdown-child").toggle();
  }
});
// выпадающий прикол
$(document).on("click", function(e) {
  if (e.target.id != 'dropdown2' && e.target.id != 'dropdown-child2' && e.target.id != 'mainmenubtn2' && e.target.id != 'btn3') {
    $("#dropdown-child2").hide();
  } else if (e.target.id != 'dropdown-child2') {
    $("#dropdown-child2").toggle();
  }
});



