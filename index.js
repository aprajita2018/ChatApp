//configure express
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//set the view engine to ejs
app.set('view engine', 'ejs');
//set the directory of views
app.set('views', './views');

//specify the path of static directory
app.use(express.static(__dirname + './public'));

//Routes
app.get('/', function(req, res){
    res.render("client");
});

io.on('connection', function (client) {

  console.log('A user has connected: ' + client.id);

  client.on('message', function(msg_recd){
    console.log('Client: ' + client.id + " has sent Message: " + msg_recd);
    if(msg_recd.user.type == 'doctor'){
      console.log("Doctor sent a message");
    }
    else{
      console.log("Patient asked a question");
    }
    io.emit('message', msg_recd);
  });

  client.on('disconnect', function () {
    console.log('client disconnect...', client.id)
  })

  client.on('error', function (err) {
    console.log('received error from client:', client.id)
    console.log(err)
  })
})

//express js server listening on 3000
// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});