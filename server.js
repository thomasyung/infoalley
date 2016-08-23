// init project
var express = require('express');
var app = express();
var http = require('http').Server(app);
var reqModule = require("request");
 
// socket.io api -- see docs at https://socket.io
var io = require('socket.io')(http); // enable websockets support

// handle socket.io events and pass along data to all connected socket.io clients
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

var hashtag = '#ux'; //change this to whatever you want to track
var stream = null;

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// get - the Admin interface for settings and remote control of TV interface
app.get("/admin", function (request, response) {
  response.sendFile(__dirname + '/views/admin.html');
});

// get - Let clients know if the Twitter stream is started
app.get("/istweetstreamstarted", function(request, response){
  if (stream !== null) {
    response.send("true");
  } else {
    response.send("false");
  }
});

// Restart the twitter stream with the new hastag filter.
app.post("/starttweetstream", function (request, response) {
  hashtag = request.query.hashtag;
  // Need to stop the previous twitter stream, so we don't get old results streamed to client
  if (stream !== null) { 
    stream.stop();
  }
  // track the live twitter stream
  stream = t.stream('statuses/filter', { track: hashtag });
  // when we get a new tweet, send it to all our connected socket.io clients
  stream.on('tweet', function(tweet){
    io.emit('twitter', tweet);
  });
  response.sendStatus(200);
});

// allow our clients to request latest tweets
app.get("/tweets", function (request, response) {
  t.get('search/tweets', { q: hashtag, count: 10 }, function(err, data, resp) {
    response.send(data.statuses);
  });
});

// get - events calendar page
app.get("/calendar", function (request, response) {
  response.sendFile(__dirname + '/views/calendar.html');
});

// get - events from city-lights | Downtown Rochester
app.get("/events", function (request, response) {
  var url = "http://www.downtownrochestermn.com/_feeds/list_events_json.pxp";
  reqModule(url, function (error, res, body) {
    if (!error && res.statusCode == 200) {
      data = JSON.parse(body);
      response.send(data.item);
    }
  });
});

// get - individual evid
app.get("/evid:id", function (request, response) {
  var evidUrl = "http://www.downtownrochestermn.com/_feeds/detail_event_item_json.pxp?evid=";
  var evid = request.params.id;
  var url = evidUrl + evid;
  reqModule(url, function (error, res, body) {
    if (!error && res.statusCode == 200) {
      data = JSON.parse(body);
      response.send(data);
    }
  });
});

// listen for requests :)
listener = http.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
