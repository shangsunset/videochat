// on load of page
$(function(){

    // when the client clicks SEND
    $('.senddata').on('click', function(){
        var message = $('.data').val();
        $('.data').val('');
        // tell server to execute 'sendChat' and send along one parameter
        socket.emit('sendChat', message);
    });

    // when the client hits ENTER on their keyboard
    $('.data').keypress(function(e) {

      if (!$(".data").val()){
      $(".senddata").attr("disabled", "disabled");
      }
      else {
      $(".senddata").attr("enabled", "enabled");
      
        if(e.which === 13) {

            $(this).blur();
            $('.senddata').focus().click().blur();
            $(this).focus();
        }
      }
 });

});







