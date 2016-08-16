// enable websockets
var socket = io();
  
$(function() {
  
  // listen for button pressed/tapped from admin interface
  socket.on('button_pressed', function(btn){
    if (btn === "one"){
      fullscreenPanelOne();
    } else if (btn === "two"){
      fullscreenPanelTwo();
    } else if (btn === "three"){
      fullscreenPanelThree();
    } else if (btn === "four"){
      fullscreenPanelFour();
    } else if (btn === "reset"){
      resetPanels();
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
    //$('#panel-one').html('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/cnfX3J1oKLY?list=PLSWR1ylG_6JYmxa73dQ8kpWK3d6_V1vWT&amp;controls=0&amp;autoplay=1" frameborder="0" allowfullscreen></iframe>');
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
  
});
