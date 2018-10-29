//configure express
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var bot = require('./botconfig.json');

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

function check_bot_response(txt){
  var questions = bot.knowledge_base;
  for(var i=0; i< questions.length; i++){
    if(questions[i].question == txt)
      return questions[i].answer;
  }
  return false;
}


io.on('connection', function (client) {

  console.log('A user has connected: ' + client.id);

  client.on('message', function(msg_recd){
    console.log('Client: ' + client.id + " has sent Message: " + JSON.stringify(msg_recd));
    if(msg_recd.user.type == 'doctor'){
      console.log("Doctor sent a message");
    }
    else{
      console.log("Patient asked a question");
    }
    io.emit('message', msg_recd);

    var bot_msg = check_bot_response(msg_recd.msg);
    if(bot_msg != false){
      console.log('Sending as bot: ' + bot.name + " - " + bot_msg);
      io.emit('message', {user: {"type": "bot", "name": bot.name}, "msg": bot_msg});
    }
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