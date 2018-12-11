 $(document).ready(function(){
    	$("#login_modal").hide();
        $("#login").click(function(){
        $("#login_modal").show();

    });

    // hide

        $("#login_close_button").click(function(){
        $("#login_modal").hide();
    });
    });