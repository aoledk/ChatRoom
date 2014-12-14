// JS for room
var maxCallers = 3;
var maxConnect = maxCallers + 1;

easyrtc.dontAddCloseButtons(true);

$(document).ready(function() {

  console.log(username);
  console.log(roomname);

  if (username === 'LDK')
    $('p').text('LDK');
  else
    $('p').text('OTHER');

  $('#records').append('<p>Records</p>');

  
  easyrtc.joinRoom(roomname, null,
    function(roomName) {
      console.log("I'm now in room " + roomName);
    },
    function(errorCode, errorText, roomName) {
      console.log("had problems joining " + roomName);
    }
  );
  easyrtc.setRoomOccupantListener(callEverybodyElse);
  easyrtc.setPeerListener(messageListener);
  easyrtc.setUsername(username);

  easyrtc.easyApp('ChatRoom', 'self', ['caller0', 'caller1', 'caller2'],
    function(myId) {
      console.log("My easyrtcid is " + myId);
      console.log("My username is " + easyrtc.idToName(myId));
    }
  );
  
});


function callEverybodyElse (roomName, otherPeople) {

  console.log(roomName);
  easyrtc.setRoomOccupantListener(null); // so we're only called once.

  var list = [];
  var connectCount = 0;
  for(var easyrtcid in otherPeople ) {
    list.push(easyrtcid);
  }
  //
  // Connect in reverse order. Latter arriving people are more likely to have
  // empty slots.
  //
  function establishConnection (position) {
    function callSuccess() {
      connectCount++;
      if( connectCount < maxCallers && position > 0) {
        establishConnection(position - 1);
      }
    }
    function callFailure(errorCode, errorText) {
      easyrtc.showError(errorCode, errorText);
      if( connectCount < maxCallers && position > 0) {
        establishConnection(position - 1);
      }
    }
    easyrtc.call(list[position], callSuccess, callFailure);

  }
  if( list.length > 0) {
    establishConnection(list.length - 1);
  }
}


function messageListener(easyrtcid, msgType, content) {
  showMessage(easyrtcid, content);
}


function showMessage(easyrtcid, content) {
  var html = '<p>From ' + easyrtc.idToName(easyrtcid) + ', data : ' + content + '</p>';
  //var html = '<p>Test Message</p>';
  $('#records').append(html);
}

function loggedInListener(roomName, otherPeers) {
  console.log(roomName);
  var otherClientDiv = document.getElementById('otherClients');
  while (otherClientDiv.hasChildNodes()) {
    otherClientDiv.removeChild(otherClientDiv.lastChild);
  }
  for(var i in otherPeers) {
    var button = document.createElement('button');
    button.onclick = function(easyrtcid) {
      return function() {
        performCall(easyrtcid);
      }
    }(i);

    label = document.createTextNode(i);
    button.appendChild(label);
    otherClientDiv.appendChild(button);
  }
}


function performCall(easyrtcid) {
  easyrtc.call(
    easyrtcid,
    function(easyrtcid) { console.log("completed call to " + easyrtcid);},
    function(errorMessage) { console.log("err:" + errorMessage);},
    function(accepted, bywho) {
      console.log((accepted?"accepted":"rejected")+ " by " + bywho);
    }
  );
}


function sendMessage () {
  var msg = $.trim($('#message').val());
  $('#message').val('');
  console.log(msg);
  if(msg && msg != '') {
    showMessage(easyrtc.myEasyrtcid, msg);
    for(var i = 0; i < maxCallers; i++ ) {
      var easyrtcid = easyrtc.getIthCaller(i);
      if(easyrtcid && easyrtcid != '') {
        easyrtc.sendPeerMessage(easyrtcid, 'im',  msg);
      }
    }
  }
}

function leaveRoom () {
  easyrtc.leaveRoom(roomname, null);
  window.location.replace('/');
}