$(function(){
  
  // keep a queue in case we get overloaded with tweets from a popular twitter search
  var tweets = [];
  
  socket.on('twitter', function(tweet){
    tweets.push(tweet);
  });
  
  // seed the first 10 tweets
  $.get('/tweets', function(tweet) {
    for (var i=0; i<tweet.length; i++){
      displayTwitter(tweet[i].text);
    }
  });
  
  // check every 5 seconds before updating the tweets from the queue
  setInterval ( function() {
    if (tweets.length > 0) {
      console.log(tweets); // DEBUG
      
      // clear out the old tweets displayed, so we don't have a page performance issue
      if ($('.ticker_item').length > 10) {
        $('.ticker_item').first().remove();
      }
      // update the page with the new tweet from the queue
      displayTwitter(tweets.shift().text);
    }
  }, 5000 );
  
  var displayTwitter = function(tweet){
    $(".ticker").append('<div class="ticker_item">' + tweet + '</div>');
  };
  
});