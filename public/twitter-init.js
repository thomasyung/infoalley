/* This file is to initialize all event handlers and the starting state for Twitter streams
 * 
 * Dependencies: 
 * - firebase  : Google's JSON database platform
 * - socket.io : Websockets support
 * - jquery    : Cross-browser JavaScript support
 */

// keep a queue in case we get overloaded with tweets from a popular twitter search
var tweets = [];
  
$(function(){
  
  // Listen for new tweets from the Twitter stream API
  socket.on('twitter', function(tweet){
    tweets.push(tweet);
    console.log(tweet.text);
  });
  
  // check every 5 seconds before updating the ticker from the tweets queue
  var tickerinterval = 5000; // 5 seconds 
  var ticker = setInterval ( function() {
    if (tweets.length > 0) {
      console.log(tweets.length); // DEBUG
      // clear out the old tweets displayed, so we don't have a page performance issue
      if ($('.ticker_item').length > 10) {
        $('.ticker_item').first().remove();
      }
      // update the ticker with the new tweet from the queue (remove from queue at same time)
      displayTwitter(tweets.shift().text);
    }
    // Sometimes the server gets reset, so we need to restart the stream
    $.get('/istweetstreamstarted', function(status){
      if (status === "false"){
        console.log("Restarting tweet stream...");
        firebase.database().ref('/config/hashtag').once('value').then(function(snapshot){
          $.post('/starttweetstream?' + $.param({"hashtag": snapshot.val()}), function(){});
        });
      }
    });
  }, tickerinterval );
  
});

// Utility to clear out existing tweets from the ticker and the tweets queue
var clearTweets = function(){
  $(".ticker").empty();
  tweets = [];
};

// Utility to grab the last 10 tweets for the hashtag in memory and display it in the ticker
var getTweets = function(){
  $.get('/tweets', function(tweet) {
    for (var i=0; i<tweet.length; i++){
      displayTwitter(tweet[i].text);
      console.log(tweet[i].text);
    }
  });
};

// Utility to add one tweet to the ticker
var displayTwitter = function(tweet){
  $(".ticker").append('<div class="ticker_item">' + tweet + '</div>');
};