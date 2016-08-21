// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var http = require('http').Server(app);
var reqModule = require("request");

// socket.io api -- see docs at https://socket.io
var io = require('socket.io')(http); // enable websockets support

io.on('connection', function(socket) {
  socket.on('button_pressed', function(btn) {
    io.emit('button_pressed', btn);
  });
  socket.on('message', function(msg) {
    io.emit('message', msg);
  });
  socket.on('disconnect', function() {
    io.emit('message', 'client disconnected');
  });
});

// twitter api -- see docs at https://github.com/ttezel/twit
var twitter = require('twit');

// initialize a new twitter instance and pass it our keys and tokens to gain access
var t = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

var hashtag = '#ux'; // change this to whatever you want to track

// track the live twitter stream
var stream = t.stream('statuses/filter', { track: hashtag });

// when we get a new tweet, send it to all our connected socket.io clients
stream.on('tweet', function(tweet){
  io.emit('twitter', tweet);
});

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/admin", function (request, response) {
  response.sendFile(__dirname + '/views/admin.html');
});

// allow our clients to request latest tweets
app.get("/tweets", function (request, response) {
  t.get('search/tweets', { q: hashtag, count: 10 }, function(err, data, resp) {
    response.send(data.statuses);
  });
});

app.get("/events", function (request, response) {
  
  var url = "http://www.downtownrochestermn.com/_feeds/list_events_json.pxp";
  var display = {};
  var data = {};
  var feed = [];
  var singleItem = {};
  
  var responseArray = [];
  
  reqModule(url, function (error, res, body) {
    if (!error && res.statusCode == 200) {
      data = JSON.parse(body);
      feed = data.item;
      // singleItem = feed[0];
      response.send(feed);
    }
  });
});

//2nd call to city-lights for individual event obj - need to pass evid

// listen for requests :)
listener = http.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
