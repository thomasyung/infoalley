// enable websockets
var socket = io();
  
$(function() {
  
  // Fill content in the panels from YouTube or Google Slides
  if (localStorage.getItem('panel-one')) {
    $('#panel-one').html(IFRAME_TEMPLATE(localStorage.getItem('panel-one')));
  }
  if (localStorage.getItem('panel-three')) {
    $('#panel-three').html(IFRAME_TEMPLATE(localStorage.getItem('panel-three')));
  }
  if (localStorage.getItem('panel-four')) {
    $('#panel-four').html(IFRAME_TEMPLATE(localStorage.getItem('panel-four')));
  }
  
  // listen for button pressed/tapped from admin interface
  socket.on('button_pressed', function(btn){
    if (btn.button_pressed === "one"){
      fullscreenPanelOne();
    } else if (btn.button_pressed === "two"){
      fullscreenPanelTwo();
    } else if (btn.button_pressed === "three"){
      fullscreenPanelThree();
    } else if (btn.button_pressed === "four"){
      fullscreenPanelFour();
    } else if (btn.button_pressed === "reset"){
      resetPanels();
    } else if (btn.button_pressed === "panel-one-btn"){
      localStorage.setItem('panel-one', btn.value);
      $('#panel-one').html(IFRAME_TEMPLATE(btn.value));
    } else if (btn.button_pressed === "panel-three-btn"){
      localStorage.setItem('panel-three', btn.value);
      $('#panel-three').html(IFRAME_TEMPLATE(btn.value));
    } else if (btn.button_pressed === "panel-four-btn"){
      localStorage.setItem('panel-four', btn.value);
      $('#panel-four').html(IFRAME_TEMPLATE(btn.value));
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

var IFRAME_TEMPLATE = function(src){
  return '<iframe width="100%" height="100%" src="'+src+'" frameborder="0" allowfullscreen></iframe>';
};
