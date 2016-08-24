// enable websockets
var socket = io();
  
$(function() {
  
  var dbRef = firebase.database().ref('/config');
  dbRef.once('value').then(function(snapshot){
    var config = snapshot.val();
    // Fill content in the panels
    if (config.panel_one){
      $('#panel-one').html(IFRAME_TEMPLATE(config.panel_one));
    }
    if (config.panel_two){
      $('#panel-two').html(IFRAME_TEMPLATE(config.panel_two));
    }
    if (config.panel_three){
      $('#panel-three').html(IFRAME_TEMPLATE(config.panel_three));
    }
    if (config.panel_four){
      $('#panel-four').html(IFRAME_TEMPLATE(config.panel_four));
    }
    if (config.hashtag){
      $.get('/istweetstreamstarted', function(status){
        console.log(status);
        if (status === "false"){
          $.post('/starttweetstream?' + $.param({"hashtag": config.hashtag}), function() {
            getTweets();
          });
        } else if (status === "true"){
          getTweets();
        }
      });
    }
  });
  
  // listen for button pressed/tapped from admin interface
  socket.on('button_pressed', function(btn){
    if (btn.button_pressed === "one"){
      fullscreenPanelOne();
    } else if (btn.button_pressed === "panel-one-play"){
      commandYouTube({'command':'playVideo','div':'panel-one'});
    } else if (btn.button_pressed === "panel-one-pause"){
      commandYouTube({'command':'pauseVideo','div':'panel-one'});
    } else if (btn.button_pressed === "two"){
      fullscreenPanelTwo();
    } else if (btn.button_pressed === "panel-two-play"){
      commandYouTube({'command':'playVideo','div':'panel-two'});
    } else if (btn.button_pressed === "panel-two-pause"){
      commandYouTube({'command':'pauseVideo','div':'panel-two'});
    } else if (btn.button_pressed === "three"){
      fullscreenPanelThree();
    } else if (btn.button_pressed === "panel-three-play"){
      commandYouTube({'command':'playVideo','div':'panel-three'});
    } else if (btn.button_pressed === "panel-three-pause"){
      commandYouTube({'command':'pauseVideo','div':'panel-three'});
    } else if (btn.button_pressed === "four"){
      fullscreenPanelFour();
    } else if (btn.button_pressed === "panel-four-play"){
      commandYouTube({'command':'playVideo','div':'panel-four'});
    } else if (btn.button_pressed === "panel-four-pause"){
      commandYouTube({'command':'pauseVideo','div':'panel-four'});
    } else if (btn.button_pressed === "reset"){
      resetPanels();
    } else if (btn.button_pressed === "panel-one-btn"){
      $('#panel-one').html(IFRAME_TEMPLATE(btn.value));
    } else if (btn.button_pressed === "panel-two-btn"){
      $('#panel-two').html(IFRAME_TEMPLATE(btn.value));
    } else if (btn.button_pressed === "panel-three-btn"){
      $('#panel-three').html(IFRAME_TEMPLATE(btn.value));
    } else if (btn.button_pressed === "panel-four-btn"){
      $('#panel-four').html(IFRAME_TEMPLATE(btn.value));
    } else if (btn.button_pressed === "hashtag"){
      clearTweets();
      $.post('/starttweetstream?' + $.param({"hashtag": btn.value}), function() {
        getTweets();
      });
    } 
  });
  
  // keyboard event handlers -- in case socket.io is not available
  $(document).keydown(function(e){
    console.log(e.keyCode);
    if (e.keyCode == 49) { // 1
      fullscreenPanelOne();
    } else if (e.keyCode == 50) { // 2
      fullscreenPanelTwo();
    } else if (e.keyCode == 51) { // 3
      fullscreenPanelThree();
    } else if (e.keyCode == 52) { // 4
      fullscreenPanelFour();
    } else if (e.keyCode == 27) { // ESC
      resetPanels();
    }
  });
  
  var fullscreenPanelOne = function(){
    $('#panel-four').css({'width':'0%', 'height':'0%'});
    $('#panel-three').css({'width':'0%', 'height':'0%'});
    $('#panel-two').css({'width':'0%', 'height':'0%'});
    $('#panel-one').css({'width':'100%', 'height':'92%'});
  };
  
  var fullscreenPanelTwo = function(){
    $('#panel-four').css({'width':'0%', 'height':'0%'});
    $('#panel-three').css({'width':'0%', 'height':'0%'});
    $('#panel-two').css({'width':'100%', 'height':'92%'});
    $('#panel-one').css({'width':'0%', 'height':'0%'});
  };
  
  var fullscreenPanelThree = function(){
    $('#panel-four').css({'width':'0%', 'height':'0%'});
    $('#panel-three').css({'width':'100%', 'height':'92%'});
    $('#panel-two').css({'width':'0%', 'height':'0%'});
    $('#panel-one').css({'width':'0%', 'height':'0%'});
  };
  
  var fullscreenPanelFour = function(){
    $('#panel-four').css({'width':'100%', 'height':'92%'});
    $('#panel-three').css({'width':'0%', 'height':'0%'});
    $('#panel-two').css({'width':'0%', 'height':'0%'});
    $('#panel-one').css({'width':'0%', 'height':'0%'});
  };
  
  var resetPanels = function(){
    $('#panel-four').css({'width':'50%', 'height':'46%'});
    $('#panel-three').css({'width':'50%', 'height':'46%'});
    $('#panel-two').css({'width':'50%', 'height':'46%'});
    $('#panel-one').css({'width':'50%', 'height':'46%'});
  };
  
  var commandYouTube = function(options){
    var div = document.getElementById(options.div);
    var iframe = div.getElementsByTagName("iframe")[0].contentWindow;
    iframe.postMessage('{"event":"command","func":"' + options.command + '","args":""}','*');
  };
  
});

var IFRAME_TEMPLATE = function(src){
  return '<iframe width="100%" height="100%" src="' + src + '" frameborder="0" allowfullscreen></iframe>';
};
