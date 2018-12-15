$(function(){
	$('#make_select').on('change', function(that) {
		var val = $(this).val();
		var mark = false;

		$(this).find('option').each(function(i, el) {
			if(val !== '*') {
				if($(el).val() === val) {
					mark = $(el).text();
				}	
			} else {
			}
		});

		$('#model_select option').each(function(i, el) {
			if(!mark) {
				$(el).show();
			} else {
				if($(el).attr('data-mark') === mark) {
					$(el).show();
				} else {
					$(el).hide();
				}
			}
		})
	})
})
