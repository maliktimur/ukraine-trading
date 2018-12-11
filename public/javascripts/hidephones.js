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
