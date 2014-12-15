// JS for index

$('#submit').click(function() {
  var user = $('#username').val();
  var room = $('#roomname').val();
  if (user == '' || room == '') {
  	$('#login_msg').val('Empty username OR Empty roomname');
  	window.location.replace('/');
  }
});