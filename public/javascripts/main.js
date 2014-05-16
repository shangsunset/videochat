// on load of page
$(function(){



// when the client hits ENTER on their keyboard
$('.textContent').keypress(function(e) {

  if(e.which === 13) {
    e.preventDefault();

    if ($(".textContent").val().trim().length === 0){
      $(".sendContent").attr("disabled", "disabled");
    }
    else{
    $(".sendContent").attr("enabled", "enabled");
      var message = $('.textContent').val();
    $('.textContent').val('');
    // tell server to execute 'sendChat' and send along one parameter
    socket.emit('sendChat', message);
  }
}

});

// $('#hangup').on('click', function () {
	
// 	console.log('Hanging up. hangup button worked');
// 	handleRemoteHangup()
// 	sendMessage('bye');
// })





});







