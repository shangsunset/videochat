"use strict";

var isChannelReady;
var isInitiator = false;
var isStarted = false;
var localStream;
var pc;
var remoteStream;
var turnReady;

var pc_config = {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};

var pc_constraints = {'optional': [{'DtlsSrtpKeyAgreement': true}]};

// Set up audio and video regardless of what devices are present.
var sdpConstraints = {'mandatory': {
  'OfferToReceiveAudio':true,
  'OfferToReceiveVideo':true }};

/////////////////////////////////////////////


var room = $('#roomName span').text();
var roomId = $('#roomId span').text();



var socket = io.connect();

if (room) {
  console.log('Create or join room', room);
  socket.emit('create or join', room);
}

//when event 'created' is fired from server side, set isInitiator to true. fire event 'addUser' back to server side
socket.on('created', function (room){
  console.log('Created room ' + room);
  isInitiator = true;
  socket.emit('addUser', 'john');  //prompt('whats your name?')
  console.log('addUser() called in crated...');

});

// socket.on('full', function (room){
  
    
// });
  
socket.on('join', function (room){
  console.log('Another peer made a request to join room ' + room);
  console.log('This peer is the initiator of room ' + room + '!');
  isChannelReady = true;
});

//when a user joins the room, fires event 'addUser', 'updateStartTime' with roomId back to server side
socket.on('joined', function (room){
  console.log('This peer has joined room ' + room);
  isChannelReady = true;
  socket.emit('addUser', 'eric'); //prompt('whats your name?')
  console.log('addUser() called in joined...');
  var startTime = new Date();
  console.log("startTime: " + startTime)
  socket.emit('updateStartTime', roomId);
});

socket.on('log', function (array){
  console.log.apply(console, array);
});

//when server side fires 'updateChat', client side append the data to the DOM
socket.on('updateChat', function(username, data){
    $('#conversation .wrapword').append(username + ' : ' + data + '<br>');
    var conversation = document.getElementById('conversation');
    conversation.scrollTop = conversation.scrollHeight;



});

socket.on('updateUser', function(users){
   // $('#users').empty();
    $.each(users, function(username){
      users[username] = username;
    });

    console.log('obj size: ' + objectSize(users));
    console.log(JSON.stringify(users));
   
  

});


//a way to find out an object size
function objectSize(the_object) {
  /* function to validate the existence of each key in the object to get the number of valid keys. */
  var object_size = 0;
  for (var key in the_object){
    if (the_object.hasOwnProperty(key)) {
      object_size++;
    }
  }
  return object_size;
}
   

function sendMessage(message){
  // console.log('Client sending message: ', message);
  // if (typeof message === 'object') {
  //   message = JSON.stringify(message);
  // }
  socket.emit('message', message);
}


//determine the status of the peer connection
socket.on('message', function (message){
  console.log('Client received message:', message);
  if (message === 'got user media') {
    maybeStart();
  }
  else if (message.type === 'offer') {

    if (!isInitiator && !isStarted) {
      maybeStart();
    }
    pc.setRemoteDescription(new RTCSessionDescription(message));
    doAnswer();
  }
  else if (message.type === 'answer' && isStarted) {
    pc.setRemoteDescription(new RTCSessionDescription(message));
  }
  else if (message.type === 'candidate' && isStarted) {
    var candidate = new RTCIceCandidate({
      sdpMLineIndex: message.label,
      candidate: message.candidate
    });
    pc.addIceCandidate(candidate);
  } else if (message === 'bye' && isStarted) {
    handleRemoteHangup();
  }
});

////////////////////////////////////////////////////

var localVideo = document.querySelector('#localVideo');
var remoteVideo = document.querySelector('#remoteVideo');
var miniVideo = document.querySelector('#miniVideo');
var hangup = document.querySelector('#hangup');


// when hangup is clicked, collect recorded file and save it to disk
hangup.onclick = function () {
  console.log('Hanging up. hangup button worked');

///

                var fileName = Math.round(Math.random() * 99999999) + 99999999;

                // stop audio recorder
                recordAudio.stopRecording(function() {
                    // stop video recorder
                    recordVideo.stopRecording(function() {
                    
                        // get audio data-URL
                        recordAudio.getDataURL(function(audioDataURL) {
                        
                            // get video data-URL
                            recordVideo.getDataURL(function(videoDataURL) {
                                var files = {
                                    audio: {
                                        name: fileName + '.wav',
                                        type: recordAudio.getBlob().type || 'audio/wav',
                                        dataURL: audioDataURL
                                    },
                                    video: {
                                        name: fileName + '.webm',
                                        type: recordVideo.getBlob().type || 'video/webm',
                                        dataURL: videoDataURL
                                    }
                                };

                                socket.emit('videoRecorded', files);
                            });
                            
                        });
                        
                        
                    });
                    
                });
                
                // if firefox or if you want to record only audio
                // stop audio recorder
                 recordAudio.stopRecording(function() {
                    // get audio data-URL
                    recordAudio.getDataURL(function(audioDataURL) {
                        var files = {
                            audio: {
                                name: fileName + '.wav',
                                type: recordAudio.getBlob().type || 'audio/wav',
                                dataURL: audioDataURL
                            }
                        };
                        

                        socket.emit('videoRecorded', files);
                     });
                        
                   
                 });
  ////

  handleRemoteHangup()
  sendMessage('bye');
}

socket.on('merged', function(fileName) {
                var href = (location.href.split('/').pop().length 
                        ? location.href.replace( location.href.split('/').pop(), '' ) 
                        : location.href
                    );
                    
                href = href + '/uploads/' + fileName;
                    
                console.log('got file ' + href);
                
                
            });
            
            socket.on('ffmpeg-output', function(result) {
                if(parseInt(result) >= 100) {
                    progressBar.parentNode.style.display = 'none';
                    return;
                }
                progressBar.parentNode.style.display = 'block';
                progressBar.value = result;
                percentage.innerHTML = 'Ffmpeg Progress ' + result + "%";
            });
            
            socket.on('ffmpeg-error', function(error) {
                alert(error);
            });


//get stream and put it to localVideo
function handleUserMedia(stream) {

  console.log('Adding local stream.');
  localVideo.src = window.URL.createObjectURL(stream);
  localStream = stream;
  sendMessage('got user media');
  if (isInitiator) {
    maybeStart();
  }
}

function handleUserMediaError(error){
  console.log('getUserMedia error: ', error);
}

var constraints = {
  
   video: true

   
  
};


getUserMedia(constraints, handleUserMedia, handleUserMediaError);

console.log('Getting user media with constraints', constraints);

// if (location.hostname != "localhost") {
//   requestTurn('https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913');
// }


//open peerConnection and add stream
function maybeStart() {
  if (!isStarted && typeof localStream != 'undefined' && isChannelReady) {
    createPeerConnection();
    pc.addStream(localStream);
    isStarted = true;
    console.log('isInitiator', isInitiator);
    if (isInitiator) {
      doCall();
    }
  }
}

window.onbeforeunload = function(e){
  sendMessage('bye');
}

/////////////////////////////////////////////////////////

function createPeerConnection() {
  try {
    pc = new RTCPeerConnection(null);
    pc.onicecandidate = handleIceCandidate;
    pc.onaddstream = handleRemoteStreamAdded;
    pc.onremovestream = handleRemoteStreamRemoved;
    console.log('Created RTCPeerConnnection');
    var startingTime = new Date();
    console.log('the start time of this chat session is: ' + startingTime);
  } catch (e) {
    console.log('Failed to create PeerConnection, exception: ' + e.message);
    alert('Cannot create RTCPeerConnection object.');
      return;
  }
}



function handleIceCandidate(event) {
  console.log('handleIceCandidate event: ', event);
  if (event.candidate) {
    sendMessage({
      type: 'candidate',
      label: event.candidate.sdpMLineIndex,
      id: event.candidate.sdpMid,
      candidate: event.candidate.candidate});
  } else {
    console.log('End of candidates.');
  }
}

var recordAudio, recordVideo;

function handleRemoteStreamAdded(event) {
  console.log('Remote stream added.');
  remoteVideo.src = window.URL.createObjectURL(event.stream);
  remoteStream = event.stream;
  miniVideo.src = localVideo.src;
  localVideo.src = remoteVideo.src;
  $('#remoteVideo').remove();
 

  recordAudio = RecordRTC(event.stream, {
      onAudioProcessStarted: function() {
         recordVideo.startRecording();         
          
      }
  });

   recordVideo = RecordRTC(event.stream, {
      type: 'video'
  });

  recordAudio.startRecording();

}

function handleCreateOfferError(event){
  console.log('createOffer() error: ', e);
}

function doCall() {
  console.log('Sending offer to peer');
  pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
}

function doAnswer() {
  console.log('Sending answer to peer.');
  pc.createAnswer(setLocalAndSendMessage, null, sdpConstraints);
}

function setLocalAndSendMessage(sessionDescription) {
  // Set Opus as the preferred codec in SDP if Opus is present.
  sessionDescription.sdp = preferOpus(sessionDescription.sdp);
  pc.setLocalDescription(sessionDescription);
  console.log('setLocalAndSendMessage sending message' , sessionDescription);
  sendMessage(sessionDescription);
}

function requestTurn(turn_url) {
  var turnExists = false;
  for (var i in pc_config.iceServers) {
    if (pc_config.iceServers[i].url.substr(0, 5) === 'turn:') {
      turnExists = true;
      turnReady = true;
      break;
    }
  }
  if (!turnExists) {
    console.log('Getting TURN server from ', turn_url);
    // No TURN server. Get one from computeengineondemand.appspot.com:
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
      if (xhr.readyState === 4 && xhr.status === 200) {
        var turnServer = JSON.parse(xhr.responseText);
        console.log('Got TURN server: ', turnServer);
        pc_config.iceServers.push({
          'url': 'turn:' + turnServer.username + '@' + turnServer.turn,
          'credential': turnServer.password
        });
        turnReady = true;
      }
    };
    xhr.open('GET', turn_url, true);
    xhr.send();
  }
}


function handleRemoteStreamRemoved(event) {
  console.log('Remote stream removed. Event: ', event);
  
}



function removeRemoteVideo() {
    localVideo.src = miniVideo.src;
    $('#miniVideo').remove();
}


function handleRemoteHangup() {
  console.log('Session terminated.');
  removeRemoteVideo();
  var finishingTime = new Date();
  console.log('the finishing time of this chat session is: ' + finishingTime);
  stop();
  isInitiator = false;
}

function stop() {
  isStarted = false;
  // isAudioMuted = false;
  // isVideoMuted = false;
  pc.close();
  pc = null;
}



///////////////////////////////////////////

// Set Opus as the default audio codec if it's present.
function preferOpus(sdp) {
  var sdpLines = sdp.split('\r\n');
  var mLineIndex;
  // Search for m line.
  for (var i = 0; i < sdpLines.length; i++) {
      if (sdpLines[i].search('m=audio') !== -1) {
        mLineIndex = i;
        break;
      }
  }
  if (mLineIndex === null) {
    return sdp;
  }

  // If Opus is available, set it as the default in m line.
  for (i = 0; i < sdpLines.length; i++) {
    if (sdpLines[i].search('opus/48000') !== -1) {
      var opusPayload = extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
      if (opusPayload) {
        sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex], opusPayload);
      }
      break;
    }
  }

  // Remove CN in m line and sdp.
  sdpLines = removeCN(sdpLines, mLineIndex);

  sdp = sdpLines.join('\r\n');
  return sdp;
}

function extractSdp(sdpLine, pattern) {
  var result = sdpLine.match(pattern);
  return result && result.length === 2 ? result[1] : null;
}

// Set the selected codec to the first in m line.
function setDefaultCodec(mLine, payload) {
  var elements = mLine.split(' ');
  var newLine = [];
  var index = 0;
  for (var i = 0; i < elements.length; i++) {
    if (index === 3) { // Format of media starts from the fourth.
      newLine[index++] = payload; // Put target payload to the first.
    }
    if (elements[i] !== payload) {
      newLine[index++] = elements[i];
    }
  }
  return newLine.join(' ');
}

// Strip CN from sdp before CN constraints is ready.
function removeCN(sdpLines, mLineIndex) {
  var mLineElements = sdpLines[mLineIndex].split(' ');
  // Scan from end for the convenience of removing an item.
  for (var i = sdpLines.length-1; i >= 0; i--) {
    var payload = extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
    if (payload) {
      var cnPos = mLineElements.indexOf(payload);
      if (cnPos !== -1) {
        // Remove CN payload from m line.
        mLineElements.splice(cnPos, 1);
      }
      // Remove CN line in sdp
      sdpLines.splice(i, 1);
    }
  }

  sdpLines[mLineIndex] = mLineElements.join(' ');
  return sdpLines;
}





