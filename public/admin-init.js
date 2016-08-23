/* This file is to initialize all event handlers and the starting state for the /admin page
 * 
 * Dependencies: 
 * - firebase  : Google's JSON database platform
 * - socket.io : Websockets support
 * - jquery    : Cross-browser JavaScript support
 */
$(function(){
  
  // Utility to toggle display of the Play/Pause buttons for YouTube links with enablejasapi=1
  var toggleYouTubePlayPause = function(options){
    if(options.src.indexOf('enablejsapi=1')!=-1){
      $(options.panelplay).show();
      $(options.panelpause).show();
    } else {
      $(options.panelplay).hide();
      $(options.panelpause).hide();
    }
  };
  
  // Populate fields data from the Firebase datastore
  firebase.database().ref('/config').once('value').then(function(snapshot){
    var config = snapshot.val();
    $('input[name=hashtag]').val(config.hashtag);
    $('input[name=panel-one]').val(config.panel_one);
    $('input[name=panel-two]').val(config.panel_two);
    $('input[name=panel-three]').val(config.panel_three);
    $('input[name=panel-four]').val(config.panel_four);
    toggleYouTubePlayPause({src:config.panel_one, panelplay:'#panel-one-play', panelpause:'#panel-one-pause'});
    toggleYouTubePlayPause({src:config.panel_two, panelplay:'#panel-two-play', panelpause:'#panel-two-pause'});
    toggleYouTubePlayPause({src:config.panel_three, panelplay:'#panel-three-play', panelpause:'#panel-three-pause'});
    toggleYouTubePlayPause({src:config.panel_four, panelplay:'#panel-four-play', panelpause:'#panel-four-pause'});
  });
  
  // Initialize the websockets reference so we can send commands to the TV interface
  var socket = io();
  
  // Handle clicks for the 1, 2, 3, 4, reset, play, pause buttons
  $('.panel-btn').click(function(){
    var button = $(this).attr('id');
    socket.emit("button_pressed", {"button_pressed": button}); // Send command to TV interface
  });
  
  // Handle click for Update on the Hashtag field
  $('#hashtag').click(function(){
    var button = $(this).attr('id');
    var hashtag = $('input[name=hashtag]').val();
    firebase.database().ref('/config/hashtag').set(hashtag); // Update value on the Firebase datastore
    socket.emit("button_pressed", {"button_pressed": button, "value": hashtag}); // Send command to TV interface
  });
  
  // Handle click for Update on the Panel One field
  $('#panel-one-btn').click(function(){
    var button = $(this).attr('id');
    var val = $('input[name=panel-one]').val();
    firebase.database().ref('/config/panel_one').set(val); // Update value on the Firebase datastore
    toggleYouTubePlayPause({src:val, panelplay:'#panel-one-play', panelpause:'#panel-one-pause'});
    socket.emit("button_pressed", {"button_pressed": button, "value": val}); // Send command to TV interface
  });
  
  // Handle click for Update on the Panel Two field
  $('#panel-two-btn').click(function(){
    var button = $(this).attr('id');
    var val = $('input[name=panel-two]').val();
    firebase.database().ref('/config/panel_two').set(val); // Update value on the Firebase datastore
    toggleYouTubePlayPause({src:val, panelplay:'#panel-two-play', panelpause:'#panel-two-pause'});
    socket.emit("button_pressed", {"button_pressed": button, "value": val}); // Send command to TV interface
  });
  
  // Handle click for Update on the Panel Three field
  $('#panel-three-btn').click(function(){
    var button = $(this).attr('id');
    var val = $('input[name=panel-three]').val();
    firebase.database().ref('/config/panel_three').set(val); // Update value on the Firebase datastore
    toggleYouTubePlayPause({src:val, panelplay:'#panel-three-play', panelpause:'#panel-three-pause'});
    socket.emit("button_pressed", {"button_pressed": button, "value": val}); // Send command to TV interface
  });
  
  // Handle click for Update on the Panel Four field
  $('#panel-four-btn').click(function(){
    var button = $(this).attr('id');
    var val = $('input[name=panel-four]').val();
    firebase.database().ref('/config/panel_four').set(val); // Update value on the Firebase datastore
    toggleYouTubePlayPause({src:val, panelplay:'#panel-four-play', panelpause:'#panel-four-pause'});
    socket.emit("button_pressed", {"button_pressed": button, "value": val}); // Send command to TV interface
  });
  
});