var Room = require('../models/database').Room;
var fs = require('fs'),
    sys = require('sys'),
    exec = require('child_process').exec;
    
module.exports = function (io) {
	
	var userList = {};
	var roomId;

//everything happends after connection is setup
io.sockets.on('connection', function (socket){

	function log(){
		var array = [">>> Message from server: "];
		for (var i = 0; i < arguments.length; i++) {
			array.push(arguments[i]);
			}
		socket.emit('log', array);
	}

    //writed recorded file to disk
	socket.on('videoRecorded', function(data) {
          ffmpeg_finished = false;

        writeToDisk(data.audio.dataURL, data.audio.name);
        
        // if it is chrome
        if(data.video) {
            writeToDisk(data.video.dataURL, data.video.name);
            merge(socket, data.audio.name, data.video.name);
        }
        
        // if it is firefox or if user is recording only audio
        else socket.emit('merged', data.audio.name);
    });
	

	socket.on('message', function (message) {
		log('Got message: ', message);
    // For a real app, should be room only (not broadcast)
		socket.broadcast.emit('message', message);
	});

    //different situations based on different number of clients in a room
	socket.on('create or join', function (room) {

		var numClients = io.sockets.clients(room).length;

		log('Room ' + room + ' has ' + numClients + ' client(s)');
		log('Request to create or join room', room);


		if (numClients === 0){
			socket.join(room);
			socket.emit('created', room);
		} else if (numClients === 1 ) {

			io.sockets.in(room).emit('join', room);
			socket.join(room);
			socket.emit('joined', room);

            //when this event is fired from the client side, 
            //finde the room with roomId passed from client side and put the data now to database
			socket.on('updateStartTime', function (roomId) {
				var date = new Date();
				log("from server: " + date)
				
								
				log('roomId:' + roomId) 
				Room
					.find({where: {room_id: roomId}})
					.complete(function (err, room) {
						if (err) console.log(err);
                        //update attribute in the database
						room
							.updateAttributes({
								start_time: date
							})
							.success(function (st) {
								
								console.log("st now is: " + JSON.stringify(st.start_time));
							})
						log("star_time: " + room.start_time);
					})

                //when a user exits, record the finishing time for the chat and store it in the database
				socket.on('disconnect', function(){

					var date = new Date();	
				
					Room
						.find({where: {room_id: roomId}})
						.complete(function (err, room) {
							if (err) console.log(err);

							room
								.updateAttributes({
									end_time: date
								})
								.success(function (et) {
									
									console.log("et now is: " + JSON.stringify(et.end_time));
								})
							
						})

					

			        delete userList[socket.username];

			        io.sockets.emit('updateUser', userList);

			        socket.broadcast.emit('updateChat', 'SERVER', socket.username + ' has disconnected...');
			        

			    });
				
			})




		} else { // max two clients
			socket.emit('full', room);
			
		}

	socket.emit('emit(): client ' + socket.id + ' joined room ' + room);
	socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room);

	});


	
    //when a user is added, broadcast to all the users in that room
	socket.on('addUser', function(username){
         // we store the username in the socket session for this client
        socket.username = username;
        //store user in userList
        userList[username] = username;
        //echo to the client they are connected
        socket.emit('updateChat', 'SERVER', 'you have connected');

        socket.broadcast.emit('updateChat', 'SERVER', username + ' has connected');

        log("obj" + JSON.stringify(userList));

        io.sockets.emit('updateUser', userList);

        
      
    });

	socket.on('sendChat', function(data){
         io.sockets.emit('updateChat', socket.username, data);
     });

	
			        
       
	
	
});

function writeToDisk(dataURL, fileName) {
    var fileExtension = fileName.split('.').pop(),
        fileRootNameWithBase = './uploads/' + fileName,
        filePath = fileRootNameWithBase,
        fileID = 2,
        fileBuffer;

    while (fs.existsSync(filePath)) {
        filePath = fileRootNameWithBase + '(' + fileID + ').' + fileExtension;
        fileID += 1;
    }

    dataURL = dataURL.split(',').pop();
    fileBuffer = new Buffer(dataURL, 'base64');
    fs.writeFileSync(filePath, fileBuffer);

    console.log('filePath', filePath);
}

function merge(socket, audioName, videoName) {
    // detect the current operating system
    var isWin = !!process.platform.match(/^win/);

    if (isWin) {
        ifWin(socket, audioName, videoName);
    } else {
        ifMac(socket, audioName, videoName);
    }
    
    readFfmpeOutput(audioName, socket);
}

var ffmpeg_finished = false;

function ifWin(socket, audioName, videoName) {
    // following command tries to merge wav/webm files using ffmpeg
    var merger = __dirname + '\\merger.bat';
    var audioFile = __dirname + '\\uploads\\' + audioName;
    var videoFile = __dirname + '\\uploads\\' + videoName;
    var mergedFile = __dirname + '\\uploads\\' + audioName.split('.')[0] + '-merged.webm';

    // if a "directory" has space in its name; below command will fail
    // e.g. "c:\\dir name\\uploads" will fail.
    // it must be like this: "c:\\dir-name\\uploads"
    var command = merger + ', ' + videoFile + " " + audioFile + " " + mergedFile + ' ' + audioName.split('.')[0] + '';

    var cmd = exec(command, function (error) {
        if (error) {
            console.log(error.stack);
            console.log('Error code: ' + error.code);
            console.log('Signal received: ' + error.signal);
        } else {
            ffmpeg_finished = true;
            socket.emit('merged', audioName.split('.')[0] + '-merged.webm');

            // removing audio/video files
            fs.unlink(audioFile);
            fs.unlink(videoFile);

            // auto delete file after 1-minute
            setTimeout(function () {
                fs.unlink(mergedFile);
            }, 60 * 1000);
        }
    });
}

function ifMac(response, audioName, videoName) {
    // its probably *nix, assume ffmpeg is available
    var audioFile = __dirname + '/uploads/' + audioName;
    var videoFile = __dirname + '/uploads/' + videoName;
    var mergedFile = __dirname + '/uploads/' + audioName.split('.')[0] + '-merged.webm';
    var util = require('util'),
        exec = require('child_process').exec;
    //child_process = require('child_process');

    var command = "ffmpeg -i " + videoFile + " -i " + audioFile + " -map 0:0 -map 1:0 " + mergedFile + '  1> ffmpeg-output/%4.txt 2>&1';

    var child = exec(command, function (error) {
        if (error) {
            console.log(error.stack);
            console.log('Error code: ' + error.code);
            console.log('Signal received: ' + error.signal);

        } else {
            ffmpeg_finished = true;
            socket.emit('merged', audioName.split('.')[0] + '-merged.webm');

            // removing audio/video files
            fs.unlink(audioFile);
            fs.unlink(videoFile);

            // auto delete file after 1-minute
            setTimeout(function () {
                fs.unlink(mergedFile);
            }, 60 * 1000);
        }
    });
}

function readFfmpeOutput(fName, socket) {
    if (ffmpeg_finished) return;
    fs.readFile('ffmpeg-output/' + fName.split('.')[0] + '.txt', 'utf8', function (err, content) {
        if (!err && content.match(/Duration: (.*?), start:/)) {
            var duration = 0,
                time = 0,
                progress = 0;
            var resArr = [];
            var matches = (content) ? content.match(/Duration: (.*?), start:/) : [];
            if (matches.length > 0) {
                var rawDuration = matches[1];
                var ar = rawDuration.split(":").reverse();
                duration = parseFloat(ar[0]);
                if (ar[1]) duration += parseInt(ar[1]) * 60;
                if (ar[2]) duration += parseInt(ar[2]) * 60 * 60;
                matches = content.match(/time=(.*?) bitrate/g);
                if (content.match(/time=(.*?) bitrate/g) && matches.length > 0) {
                    var rawTime = matches.pop();
                    rawTime = rawTime.replace('time=', '').replace(' bitrate', '');
                    ar = rawTime.split(":").reverse();
                    time = parseFloat(ar[0]);
                    if (ar[1]) time += parseInt(ar[1]) * 60;
                    if (ar[2]) time += parseInt(ar[2]) * 60 * 60;
                    progress = Math.round((time / duration) * 100);
                }

                socket.emit('ffmpeg-output', progress);
            } else if (content.indexOf('Permission denied') > -1) {
                socket.emit('ffmpeg-error', 'ffmpeg : Permission denied, either for ffmpeg or upload location ...');
            }

            readFfmpeOutput(fName, socket);
        } else setTimeout(function() {
            readFfmpeOutput(fName, socket);
        }, 500);
    });
}




function objectSize(obj) {
  /* function to validate the existence of each key in the object to get the number of valid keys. */
  var objSize = 0;
  for (var key in obj){
    if (obj.hasOwnProperty(key)) {
      objSize++;
    }
  }
  return objSize;
}

}

